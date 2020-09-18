import { useCallback, useContext, useMemo, createContext } from 'react'
import { providers } from 'ethers'
import { ChainUnsupportedError, UseWalletProvider, useWallet } from 'use-wallet'
import { getNetworkName } from '../utils/web3-utils'

const CHAIN_ID = 1

const WalletAugmentedContext = createContext()

const logError = (err, ...messages) => {
  if (typeof window !== undefined) {
    window.alert(messages.join(' '))
  }

  console.error(...messages, err)
}

const useWalletAugmented = () => {
  return useContext(WalletAugmentedContext)
}

const WalletAugmented = props => {
  const { children } = props

  const wallet = useWallet()
  const { ethereum, connect: activate } = wallet

  const ethersProvider = useMemo(() => (
    ethereum ? new providers.Web3Provider(ethereum) : null
  ), [ethereum])

  const augmentedActivate = useCallback(async type => {
    try {
      await activate(type)

      return true
    } catch (error) {
      if (error instanceof ChainUnsupportedError) {
        logError(
          error,
          `Unsupported chain: please connect to the network called ${getNetworkName(
            CHAIN_ID
          )} in your Ethereum Provider.`
        )

        return
      }

      logError(
        error,
        'An error happened while trying to activate the wallet, please try again.'
      )
    }
  }, [activate])

  const contextValue = useMemo(
    () => ({
      ...wallet,
      activate: augmentedActivate,
      networkName: getNetworkName(CHAIN_ID),
      ethersProvider,
    }),
    [wallet, ethersProvider, augmentedActivate]
  )

  return (
    <WalletAugmentedContext.Provider value={contextValue}>
      {children}
    </WalletAugmentedContext.Provider>
  )
}

const WalletProvider = props => {
  const { children } = props

  return (
    <UseWalletProvider
      chainId={CHAIN_ID}
      connectors={{
        fortmatic: { apiKey: 'pk_live_262B43464149D868' },
        portis: { dAppId: 'f0a2ea04-f728-4fa2-b49c-83e9495495ee' }
      }}
    >
      <WalletAugmented>{children}</WalletAugmented>
    </UseWalletProvider>
  )
}

export { useWalletAugmented, WalletProvider }