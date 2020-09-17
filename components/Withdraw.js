import { useState, useEffect, useCallback } from 'react'
import TokenAmount from 'token-amount'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import moment from 'moment'

import { useWalletAugmented } from '../lib/WalletProvider'
import { useBalanceOf, useUniStaked, useWithdraw } from '../lib/Contracts'
import Stats from './Stats'
import Loader from './Loader'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    marginTop: 20,
    marginBottom: 20
  },
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    padding: 8,
    width: '100%'
  },
  amountText: {
    display: 'block',
    fontWeight: 300,
    color: '#7893ae'
  },
  amountValue: {
    display: 'block',
    fontSize: 24
  },
  action: {
    marginTop: 30
  },
  marginTop: {
    marginTop: theme.spacing(4)
  }
}))

const Withdraw = () => {
  const classes = useStyles()
  const { account, status } = useWalletAugmented()
  const selectedTokenBalance = useBalanceOf('UNI_TOKEN')
  const [disabled, setDisabled] = useState(false)
  const [pending, setPending] = useState(false)
  const [withdrawTx, setWithdrawTx] = useState('')
  const [showWithdraw, setShowWithdraw] = useState(false)
  const { loading: loadingStaked, staked } = useUniStaked(account)
  const withdraw = useWithdraw()

  const handleSubmit = async () => {
    setDisabled(true)
    setPending(true)

    try {
      const withdrawResult = await withdraw()
      await withdrawResult.wait(1)

      if (withdrawResult) {
        setWithdrawTx(withdrawResult.hash)
        setShowWithdraw(true)
        setPending(false)
      }
    } catch (error) {
      console.log(error)
      setPending(false)
      setDisabled(false)
    }
  }

  useEffect(() => {
    const now = moment.utc()
    const endDate = moment.utc([2020, 9, 8, 12])

    if (now > endDate) {
      setDisable(false)
    }
  })

  const handleRefresh = () => {
    setWithdrawTx('')
    setShowWithdraw(false)
    setDisabled(false)
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
      <div className={classes.root}>
        <Card className={classes.wrap}>
          <span className={classes.amountText}>
            Amount available to withdraw
          </span>
          <span className={classes.amountValue}>
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
        </Card>
      </div>
      {status !== 'connected' ? (
        <Alert severity="warning">Please, connect your wallet to get started.</Alert>
      ) : (
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={disabled}
          onClick={disabled ? undefined : handleSubmit}
          className={classes.action}
          fullWidth
        >
          Withdraw
        </Button>
      )}
      {showWithdraw && (
        <div>
          <div className={classes.marginTop}>
            <Alert severity="success">
              <AlertTitle>Staking Transaction</AlertTitle>
              <a href={`https://rinkeby.etherscan.io/tx/${withdrawTx}`} target="_blank" rel="noopener noreferrer">
                {withdrawTx}
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

export default Withdraw