import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import {
  Contract as EthersContract,
  getDefaultProvider as getEthersDefaultProvider,
} from 'ethers'
import { bigNum } from '../utils/web3-utils'

import { useWalletAugmented } from './WalletProvider'
import unitokenAbi from './abi/uni-token.json'
import unipoolAbi from './abi/unipool.json'

const unitoken = '0xB02725788558F4633E611340a1951b89F3a0e2C9'
const unipool = '0xdCDD673F7C5eE5c91d5227B9a687Cf6Dcbc93fcb'

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
  const getApproval = useApprove()

  return useCallback(async amount => {
    try {
      if (!unipoolContract) {
        throw new Error(`Can't stake due to the unipool Address not being loaded`)
      }

      await getApproval(amount)

      return await unipoolContract.stake(amount, {
        gasLimit: 150000
      })
    } catch (error) {
      throw new Error(error.message)
    }
  }, [getApproval, unipoolContract])
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