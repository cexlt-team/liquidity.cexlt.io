import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import {
  Contract as EthersContract,
  getDefaultProvider as getEthersDefaultProvider,
  ethers
} from 'ethers'
import { bigNum } from '../utils/web3-utils'

import { useWalletAugmented } from './WalletProvider'
import clttokenAbi from './abi/clt-token.json'
import unitokenAbi from './abi/uni-token.json'
import unipoolAbi from './abi/unipool.json'

const clttoken = '0xa69f7a10dF90C4D6710588Bc18ad9bF08081f545'
const unitoken = '0x0F1b7D5E235098e9dA4AE78199021d7938C77AE6'
const unipool = '0xC250e583356C552c05Fc3B864265a58F14054dC9'
const minigpool = '0xE2741582486bF4471D093e2100DeaEC2397142d4'

const RETRY_EVERY = 2000

const contractsCache = new Map()

export const useContract = (address, abi, signer = true) => {
  const { ethersProvider } = useWalletAugmented()

  if (!address || !ethersProvider) {
    return null
  }

  if (contractsCache.has(address)) {
    return contractsCache.get(address)
  }

  const contract = new EthersContract(
    address,
    abi,
    signer ? ethersProvider.getSigner() : ethersProvider
  )

  contractsCache.set(address, contract)

  return contract
}

export const setContract = (name, signer = true) => {
  if (name === 'UNIPOOL') {
    return useContract(unipool, unipoolAbi, signer)
  } else if (name === 'UNI_TOKEN') {
    return useContract(unitoken, unitokenAbi, signer)
  } else if (name === 'CLT_TOKEN') {
    return useContract(clttoken, clttokenAbi, signer)
  }
}

export const useAllowance = () => {
  const { account } = useWalletAugmented()
  const unitokenContract = setContract('UNI_TOKEN')

  return useCallback(async () => {
    try {
      if (!unitokenContract) {
        throw new Error('UNI contract not loaded')
      }

      return await unitokenContract.allowance(account, unipool)
    } catch (error) {
      throw new Error(error.message)
    }
  }, [account, unitokenContract, unipool])
}

export const useApprove = () => {
  const unitokenContract = setContract('UNI_TOKEN')
  const getAllowance = useAllowance()

  return useCallback(async amount => {
    try {
      if (!unitokenContract) {
        throw new Error('UNI contract not loaded')
      }

      const allowance = await getAllowance()

      if (allowance.lt(amount)) {
        return await unitokenContract.approve(unipool, amount)
      }

      if (!allowance.isZero(amount)) {
        const tx = await unitokenContract.approve(unipool, '0')
        await tx.wait(1)
      }
      return await unitokenContract.approve(unipool, amount)
    } catch (error) {
      throw new Error(error.message)
    }
  },
  [getAllowance, unitokenContract, unipool])
}

export const useStake = () => {
  const unipoolContract = setContract('UNIPOOL')

  return useCallback(async amount => {
    try {
      if (!unipoolContract) {
        throw new Error(`Can't stake due to the unipool Address not being loaded`)
      }

      return await unipoolContract.stake(amount, {
        gasLimit: 150000
      })
    } catch (error) {
      throw new Error(error.message)
    }
  }, [unipoolContract])
}

export const useWithdraw = () => {
  const unipoolContract = setContract('UNIPOOL')

  return useCallback(async () => {
    try {
      if (!unipoolContract) {
        throw new Error(`Can't stake due to the unipool Address not being loaded`)
      }

      return await unipoolContract.exit()
    } catch (error) {
      throw new Error(error.message)
    }
  }, [unipoolContract])
}

export const useBalanceOf = (contractName, address = '') => {
  const { account } = useWalletAugmented()
  const [balance, setBalance] = useState(bigNum(-1))
  const tokenContract = setContract(`${contractName}`)

  const cancelBalanceUpdate = useRef(null)

  const updateBalance = useCallback(() => {
    let cancelled = false

    if (cancelBalanceUpdate.current) {
      cancelBalanceUpdate.current()
      cancelBalanceUpdate.current = null
    }

    if ((!account && !address) || !tokenContract) {
      setBalance(bigNum(-1))
      return
    }

    cancelBalanceUpdate.current = () => {
      cancelled = true
    }

    const requestedAddress = address || account

    tokenContract.balanceOf(requestedAddress).then(bal => {
      if (!cancelled && bal) {
        setBalance(bal)
      }
    })
  }, [account, address, tokenContract])

  useEffect(() => {
    updateBalance()

    if ((!account && !address) || !tokenContract) {
      return
    }

    const onTransfer = (from, to, value) => {
      if (
        from === account ||
        to === account ||
        from === address ||
        to === address
      ) {
        updateBalance()
      }
    }

    tokenContract.on('Transfer', onTransfer)

    return () => {
      tokenContract.removeListener('Transfer', onTransfer)
    }
  }, [account, address, tokenContract, updateBalance])

  return balance
}

export const useUniStaked = account => {
  const [loading, setLoading] = useState(false)
  const [staked, setStaked] = useState(bigNum(-1))
  const unipoolContract = setContract('UNIPOOL')

  useEffect(() => {
    let cancelled = false
    let retryTimer

    if (!unipoolContract || !account) {
      return
    }

    const getUniStaked = async () => {
      try {
        setLoading(true)
        const uniStaked = await unipoolContract.balanceOf(account)

        if (!cancelled) {
          setLoading(false)
          setStaked(uniStaked)
          retryTimer = setTimeout(getUniStaked, 9000)
        }
      } catch (error) {
        if (!cancelled) {
          retryTimer = setTimeout(getUniStaked, RETRY_EVERY)
        }
      }
    }

    getUniStaked()

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
    }
  }, [account, unipoolContract])

  return useMemo(() => ({ loading, staked }), [loading, staked])
}

export const useMiningPool = () => {
  const cltContract =  setContract('CLT_TOKEN')
  const [pool, setPool] = useState(bigNum(-1))

  useEffect(() => {
    const getMinigPool = async () => {
      try {
        const cltMiningPool = await cltContract.balanceOf(minigpool)

        setPool(cltMiningPool)
      } catch (error) {
        setPool(bigNum(-1))
      }
    }

    getMinigPool()
  }, [cltContract])
    
  return pool
}

export const useStakingPool = () => {
  const [loading, setLoading] = useState(false)
  const [stakedUni, setStakedUni] = useState(bigNum(-1))
  const unipoolContract = setContract('UNIPOOL')

  useEffect(() => {
    let cancelled = false
    let retryTimer

    if (!unipoolContract) {
      return
    }

    const getUniStaked = async () => {
      try {
        setLoading(true)
        const uniPool = await unipoolContract.totalSupply()

        if (!cancelled) {
          setLoading(false)
          setStakedUni(uniPool)
          retryTimer = setTimeout(getUniStaked, 9000)
        }
      } catch (error) {
        if (!cancelled) {
          retryTimer = setTimeout(getUniStaked, RETRY_EVERY)
        }
      }
    }

    getUniStaked()

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
    }
  }, [unipoolContract])

  return useMemo(() => ({ loading, stakedUni }), [loading, stakedUni])
}

export const useStakingRate = account => {
  const [loading, setLoading] = useState(false)
  const [staked, setStaked] = useState(bigNum(-1))
  const [stakedUni, setStakedUni] = useState(0)
  const [stakedRate, setStakedRate] = useState(0)
  const unipoolContract = setContract('UNIPOOL')

  useEffect(() => {
    let cancelled = false
    let retryTimer

    if (!unipoolContract) {
      return
    }

    const getUniStakedRate = async () => {
      try {
        setLoading(true)
        const uniPool = await unipoolContract.totalSupply()
        const uniStaked = await unipoolContract.balanceOf(account)

        const poolBig = uniPool.toString()
        const userBig = uniStaked.toString()

        const pool = ethers.utils.formatUnits(poolBig, 'ether')
        const user = ethers.utils.formatUnits(userBig, 'ether')

        const rate = (user / pool) * 100

        if (!cancelled) {
          setLoading(false)
          setStaked(uniStaked)
          setStakedUni(uniPool)
          setStakedRate(rate)
          retryTimer = setTimeout(getUniStakedRate, 9000)
        }
      } catch (error) {
        if (!cancelled) {
          retryTimer = setTimeout(getUniStakedRate, RETRY_EVERY)
        }
      }
    }

    getUniStakedRate()

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
    }
  }, [account, unipoolContract])

  return useMemo(() => ({ loading, staked, stakedUni, stakedRate }), [loading, staked, stakedUni, stakedRate])
}