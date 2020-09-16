import { makeStyles } from '@material-ui/core/styles'
import TokenAmount from 'token-amount'

import { useWalletAugmented } from '../lib/WalletProvider'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  wrap: {
    marginTop: theme.spacing(6),
    color: '#7893ae'
  },
  balance: {
    color: '#7893ae'
  },
  text: {
    color: '#222'
  }
}))

const Stats = props => {
  const classes = useStyles()
  const { balanceUni, decimalsUni } = props
  const { status } = useWalletAugmented()

  return (
    <div className={classes.root}>
      <div className={classes.wrap}>
        <span className={classes.text}>{' '}</span>
      </div>
      <div className={classes.balance}>
        Your account’s balance:{' '}
        <span className={classes.text}>
          {' '}
          {status === 'connected' ? `${TokenAmount.format(balanceUni.toString(), decimalsUni, {
            symbol: 'UNI-V2',
            digits: 9
          })}` : '0 (Not connected)'}
        </span>
      </div>
    </div>
  )
}

export default Stats