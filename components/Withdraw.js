import { useState, useCallback } from 'react'
import TokenAmount from 'token-amount'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import Card from '@material-ui/core/Card'

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

  return (
    <div>
      <Alert severity="info">Withdraw all of your staked UNI-V2 and claim any pending rewards</Alert>
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
        <button
          disabled={disabled}
          onClick={disabled ? undefined : handleSubmit}
          className={classes.action}
          css={`
            margin-top: 60px;
          `}
        >
          Withdraw
        </button>
      )}
    </div>
  )
}

export default Withdraw