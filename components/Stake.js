import { useState, useEffect, useCallback, useMemo } from 'react'
import { ethers } from 'ethers'
import TokenAmount from 'token-amount'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import Card from '@material-ui/core/Card'

import { useWalletAugmented } from '../lib/WalletProvider'
import { useBalanceOf, useUniStaked, useStake } from '../lib/Contracts'
import Stats from './Stats'
import Input from './Input'
import Logo from './Logo'
import { bigNum, parseUnits } from '../utils/web3-utils'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 20
  },
  amountText: {
    display: 'block',
    fontWeight: 300,
    color: '#7893ae',
    marginBottom: 12
  },
  action: {
    position: 'relative',
    border: 0,
    borderRadius: 8,
    padding: 0,
    width: '100%',
    height: 48,
    cursor: 'pointer',
    '&:active': {
      top: 1
    },
    background: 'linear-gradient(342.22deg, #01e8f7 -5.08%, #00c2ff 81.4%)',
    color: '#fff',
    mixBlendMode: 'normal',
    boxShadow: '0px 2px 2px rgba(87, 95, 119, 0.15)',
    borderRadius: 6,
    fontSize: '18px',
    textTransform: 'uppercase',
    fontWeight: 'bold'
  }
}))

const parseInputValue = (inputValue, decimals) => {
  if (decimals === -1) {
    return null
  }

  inputValue = inputValue.trim()

  const amount = parseUnits(inputValue, { digits: decimals })

  if (amount.lt(0)) {
    return null
  }

  return { amount, inputValue }
}

const useConvertInputs = () => {
  const [inputValue, setInputValue] = useState('')
  const [amountUni, setAmountUni] = useState(bigNum(0))

  const handleSetInputValue = useCallback(e => {
    const parsedValue = parseInputValue(e.target.value, 18)
    if (parsedValue !== null) {
      setInputValue(parsedValue.inputValue)
      setAmountUni(parsedValue.amount)
    }
  }, [])

  const resetInputs = useCallback(() => {
    setInputValue('')
    setAmountUni(bigNum(0))
  }, [])

  const inputValues = useMemo(
    () => ({
      amountUni,
      handleSetInputValue,
      inputValue,
      resetInputs,
      setAmountUni,
      setInputValue,
    }),
    [
      amountUni,
      handleSetInputValue,
      inputValue,
      resetInputs,
      setAmountUni,
      setInputValue,
    ]
  )

  return inputValues
}

const Stake = () => {
  const classes = useStyles()
  const { account, status } = useWalletAugmented()
  const selectedTokenBalance = useBalanceOf('UNI_TOKEN')
  const [disabled, setDisabled] = useState(false)
  const { loading: loadingStaked, staked } = useUniStaked(account)
  const stake = useStake()

  const {
    inputValue,
    handleSetInputValue,
    amountUni: amount,
    resetInputs,
    setAmountUni,
    setInputValue,
  } = useConvertInputs()

  useEffect(() => {
    resetInputs()
  }, [status, resetInputs])

  const handleMax = useCallback(() => {
    const newInputValue = ethers.utils.formatEther(
      selectedTokenBalance.toString()
    )
    setAmountUni(selectedTokenBalance)
    setInputValue(newInputValue)
  }, [selectedTokenBalance, setAmountUni, setInputValue])

  const handleSubmit = useCallback(async () => {
    try {
      setDisabled(true)

      await stake(amount)
    } catch (error) {
      throw new Error(error.message)
    } finally {
      setDisabled(false)
      resetInputs()
    }
  }, [amount, resetInputs, stake])

  const inputError = useMemo(
    () =>
      amount.gt(selectedTokenBalance) ||
      amount.eq(bigNum(0)) ||
      disabled,
    [amount, disabled, selectedTokenBalance]
  )

  return (
    <div>
      <Alert severity="info">Learn how to obtain UNI-V2 to participate in the rewards program</Alert>
      <Stats
        balanceUni={selectedTokenBalance}
        decimalsUni={18}
      />
      <Input
        disabled={status !== 'connected' || disabled}
        inputValue={inputValue}
        onChange={handleSetInputValue}
        onMax={handleMax}
      />
      <Card className={classes.root}>
        <Logo mode={'uni'} />
        <div className={classes.wrap}>
          <span className={classes.amountText}>
            Amount of UNI-V2 staked
          </span>
          <span>
            {status !== 'connected'
              ? '0'
              : loadingStaked
              ? 'Loading...'
              : TokenAmount.format(staked, 18, {
                symbol: 'UNI-V2',
                digits: 9,
              })
            }
          </span>
        </div>
      </Card>
      {status !== 'connected' ? (
        <Alert severity="warning">Please, connect your wallet to get started.</Alert>
      ) : (
        <button
          disabled={disabled || inputError}
          onClick={disabled ? undefined : handleSubmit}
          className={classes.action}
          css={`
            margin-top: 60px;
            ${disabled ||
              (inputError && 'background: #F6F9FC; color: #8398AC; cursor: default; &:active { top: 0px; }')
            }
          `}
        >
          Stake
        </button>
      )}
    </div>
  )
}

export default Stake