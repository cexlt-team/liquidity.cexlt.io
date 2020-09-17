import { useState, useEffect, useCallback } from 'react'
import TokenAmount from 'token-amount'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import moment from 'moment'

import { useWalletAugmented } from '../lib/WalletProvider'
import { useBalanceOf, useUniStaked, useWithdraw } from '../lib/Contracts'
import Stats from './Stats'

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
  }
}))

const Withdraw = () => {
  const classes = useStyles()
  const { account, status } = useWalletAugmented()
  const selectedTokenBalance = useBalanceOf('UNI_TOKEN')
  const [disabled, setDisabled] = useState(false)
  const { loading: loadingStaked, staked } = useUniStaked(account)
  const withdraw = useWithdraw()

  const handleSubmit = useCallback(async () => {
    try {
      setDisabled(true)

      await withdraw()
    } catch (error) {
      throw new Error(error.message)
    } finally {
      setDisabled(false)
    }
  }, [withdraw])

  useEffect(() => {
    const now = moment.utc()
    const endDate = moment.utc([2020, 9, 8, 12])

    if (now > endDate) {
      setDisable(false)
    }
  })

  return (
    <div>
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
    </div>
  )
}

export default Withdraw