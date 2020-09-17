import { useState, useEffect, useCallback, useMemo } from 'react'
import { ethers } from 'ethers'
import TokenAmount from 'token-amount'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import moment from 'moment'

import { useWalletAugmented } from '../lib/WalletProvider'
import { useBalanceOf, useUniStaked, useApprove, useStake } from '../lib/Contracts'
import Stats from './Stats'
import Input from './Input'
import Logo from './Logo'
import Loader from './Loader'
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
    marginTop: 30
  },
  marginTop: {
    marginTop: theme.spacing(4)
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
  const [inputDisabled, setInputDisabled] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [step, setStep] = useState('approve')
  const [pending, setPending] = useState(false)
  const [approveTx, setApproveTx] = useState('')
  const [stakeTx, setStakeTx] = useState('')
  const [showApprove, setShowApprove] = useState(false)
  const [showStake, setShowStake] = useState(false)
  const { loading: loadingStaked, staked } = useUniStaked(account)
  const approve = useApprove()
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

  const handleSubmit = async () => {
    setDisabled(true)
    setInputDisabled(true)
    setPending(true)

    try {
      if (step === 'approve') {
        const approveResult = await approve(amount)
        await approveResult.wait(1)
        if (approveResult) {
          console.log()
          setApproveTx(approveResult.hash)
          setShowApprove(true)
          setPending(false)
          setStep('stake')
          setDisabled(false)
        }
      }

      if (step === 'stake') {
        const stakeResult = await stake(amount)
        await stakeResult.wait(1)
        if (stakeResult) {
          setStakeTx(stakeResult.hash)
          setShowStake(true)
          setPending(false)
        }
      }
    } catch (error) {
      setStep('approve')
      setDisabled(false)
      setInputDisabled(false)
      resetInputs()
    }
  }

  const inputError = useMemo(
    () =>
      amount.gt(selectedTokenBalance) ||
      amount.eq(bigNum(0)) ||
      disabled,
    [amount, disabled, selectedTokenBalance]
  )

  const handleRefresh = () => {
    setApproveTx('')
    setShowApprove(false)
    setStakeTx('')
    setShowStake(false)
    setStep('approve')
    setDisabled(false)
    setInputDisabled(false)
    resetInputs()
  }

  return (
    <div>
      {pending && (
        <Loader />
      )}
      <Alert severity="info">Stacked UNI-V2 can be withdrawn after {`${moment.utc([2020, 9, 8, 12]).format('MM-DD-YYYY hh:mm')} GMT+0`}</Alert>
      <Stats
        balanceUni={selectedTokenBalance}
        decimalsUni={18}
      />
      <Input
        disabled={status !== 'connected' || inputDisabled}
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
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={disabled || inputError}
          onClick={disabled ? undefined : handleSubmit}
          className={classes.action}
          fullWidth
        >
          {step === 'approve' ? 'Approve' : 'Stake'}
        </Button>
      )}
      {showApprove && (
        <div>
          <div className={classes.marginTop}>
            <Alert severity="success">
              <AlertTitle>Approve Transaction</AlertTitle>
              <a href={`https://ropsten.etherscan.io/tx/${approveTx}`} target="_blank" rel="noopener noreferrer">
                {approveTx}
              </a>
            </Alert>
          </div>
        </div>
      )}
      {showStake && (
        <div>
          <div className={classes.marginTop}>
            <Alert severity="success">
              <AlertTitle>Staking Transaction</AlertTitle>
              <a href={`https://ropsten.etherscan.io/tx/${stakeTx}`} target="_blank" rel="noopener noreferrer">
                {stakeTx}
              </a>
            </Alert>
          </div>
          <div className={classes.marginTop}>
            <Button variant="contained" color="secondary" fullWidth onClick={handleRefresh}>Refresh</Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Stake