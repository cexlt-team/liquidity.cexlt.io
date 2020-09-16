import { ethers } from 'ethers'

const ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/

export const isAddress = address => {
  return ADDRESS_REGEX.test(address)
}

export const shortenAddress = (address, charsLength = 4) => {
  const prefixLength = 2
  if (!address) {
    return ''
  }
  if (address.length < charsLength * 2 + prefixLength) {
    return address
  }
  return (
    address.slice(0, charsLength + prefixLength) +
    '…' +
    address.slice(-charsLength)
  )
}

export const getNetworkName = chainId => {
  chainId = String(chainId)

  if (chainId === '1') return 'Mainnet'
  if (chainId === '4') return 'Rinkeby'

  return 'Unknown'
}

export const bigNum = value => {
  return new ethers.BigNumber.from(value)
}

export const parseUnits = (value, { digits = 18 } = {}) => {
  value = value.replace(/,/g, '').trim()
  try {
    return ethers.utils.parseUnits(value || '0', digits)
  } catch (err) {
    return bigNum(-1)
  }
}