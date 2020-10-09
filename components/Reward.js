import { useEffect, useState } from 'react'
import TokenAmount from 'token-amount'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import Card from '@material-ui/core/Card'
import moment from 'moment'
import { ethers } from 'ethers'

import { useWalletAugmented } from '../lib/WalletProvider'
import { useMiningPool, useStakingRate } from '../lib/Contracts'
import Logo from './Logo'
import { bigNum } from '../utils/web3-utils'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    padding: theme.spacing(1)
  },
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 20
  },
  dateNotice: {
    color: '#7893ae',
    marginTop: 20,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  wrapAlign: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  amountText: {
    display: 'block',
    fontWeight: 300,
    color: '#7893ae',
    marginBottom: 12
  },
  amountValue: {
    display: 'block',
    fontSize: 22
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
  },
  marginTop: {
    marginTop: theme.spacing(2)
  }
}))

const Reward = props => {
  const { account, status } = useWalletAugmented()
  const classes = useStyles()
  const miningPool = useMiningPool()
  const { loading: loadingStakedRate, staked, stakedUni, stakedRate } = useStakingRate(account)
  const [disabled, setDisable] = useState(true)
  const [rewardAmount, setRewardAmount] = useState(0)
  const [todayReward, setTodayReward] = useState(bigNum(-1))
  const [userReward, setUserReward] = useState(bigNum(-1))
  const [today, setToday] = useState(`${moment.utc().format('MM-DD-YYYY')} 12:00 GMT+0`)

  useEffect(() => {
    const now = moment.utc()
    const startDate = moment.utc([2020, 8, 19, 12])
    const endDate = moment.utc([2020, 9, 9, 12])
    
    if (now < startDate) {
      setToday(`${startDate.format('MM-DD-YYYY')} 12:00 GMT+0`)
    } else {
      if (now.hour() > 12) {
        const nextday = `${moment().utc().add(1, 'day').format('MM-DD-YYYY')} 12:00 GMT+0`
        setToday(nextday)
      }
    }

    if (now > endDate) {
      setDisable(false)
    }

    if (status === 'connected') {
      const totalBignumber = miningPool.toString()
      const total = ethers.utils.formatUnits(totalBignumber, 'ether')
      const period = endDate.diff(startDate, 'days')
      const rewardPer = Number(total) / period

      setTodayReward(rewardPer)

      if (stakedRate > 0) {
        const reward = rewardPer * (stakedRate / 100)
        const rewardFixed = reward.toLocaleString('en', {'minimumFractionDigits':0, 'maximumFractionDigits':18})
        setUserReward(rewardFixed)
      }
    }
  })

  useEffect(() => {
    const getReward = async () => {
      const url = 'https://liquidity.cexlt.io/api/reward'
      const data = { address: account }
      try {
        const rewardApi = await fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        })

        const result = await rewardApi.json()
        const rewardAmountValue = result.data
        const rewardAmountFixed = rewardAmountValue.toLocaleString('en', {'minimumFractionDigits':0, 'maximumFractionDigits':18})

        setRewardAmount(rewardAmountFixed)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    if (status === 'connected') {
      getReward()
    }
  })
  
  return (
    <div>
      <Alert severity="info">Claim all of your rewards from your staked UNI-V2</Alert>
      {status === 'connected' && (
        <Alert severity="info" className={classes.marginTop}>
          Rewards paid until 12:00 GMT+0 in 10-09-2020. Your amount of CLT reward will be deducted by 1%
        </Alert>
      )}
      <div>
        {status === 'connected' && (
          <div className={classes.dateNotice}>
            <div>
              {`Reward payment date: ${moment.utc([2020, 9, 9, 12]).format('MM-DD-YYYY hh:mm')} GMT+0`}
            </div>
            <div>
              {`Daily reward date: ${today}`}
            </div>
          </div>
        )}
        <Card className={classes.root}>
          <Logo mode={'clt'} />
          <div className={classes.wrapAlign}>
            <div className={classes.wrap}>
              <span className={classes.amountText}>
                Total CLT of the Mining Pool
              </span>
              <span className={classes.amountValue}>
                {status === 'connected' ? TokenAmount.format(miningPool.toString(), 18, { symbol: 'CLT' }) : '0 (Not connected)'}
              </span>
            </div>
            {status === 'connected' ? (
              <div className={classes.wrap}>
                <span className={classes.amountText}>
                  {`Total CLT to be rewarded today`}
                </span>
                <span className={classes.amountValue}>
                  {0}
                </span>
              </div>
            ) : null}
            {status === 'connected' ? (
              <div className={classes.wrap}>
                <span className={classes.amountText}>
                  {`Your amount of CLT rewarded`}
                </span>
                <span className={classes.amountValue}>
                  {`${rewardAmount} CLT`}
                </span>
              </div>
            ) : null}
          </div>
        </Card>
        <Card className={classes.root}>
          <Logo mode={'uni'} />
          <div className={classes.wrapAlign}>
            <div className={classes.wrap}>
              <span className={classes.amountText}>
                Total UNI-V2 of the Staking Pool
              </span>
              <span className={classes.amountValue}>
                {status !== 'connected'
                  ? '0 (Not connected)'
                  : loadingStakedRate
                  ? 'Loading...'
                  : TokenAmount.format(stakedUni, 18, {
                    symbol: 'UNI-V2',
                    digits: 9,
                  })
                }
              </span>
            </div>
            {status === 'connected' ? (
              <div className={classes.wrap}>
                <span className={classes.amountText}>
                  Your amount of UNI-V2 staked
                </span>
                <span className={classes.amountValue}>
                  {status !== 'connected'
                    ? '0'
                    : loadingStakedRate
                    ? 'Loading...'
                    : TokenAmount.format(staked, 18, {
                      symbol: 'UNI-V2',
                      digits: 9,
                    })
                  }
                </span>
              </div>
            ) : null}
          </div>
        </Card>
        {(status === 'connected' && stakedRate > 0) ? (
          <Card className={classes.root}>
            <div className={classes.wrapAlign}>
              <div className={classes.wrap}>
                <span className={classes.amountText}>
                  Your rate of UNI-V2 staked today
                </span>
                <span className={classes.amountValue}>
                  {status !== 'connected'
                    ? '0'
                    : loadingStakedRate
                    ? 'Loading...'
                    : `${stakedRate.toFixed(2)} %`
                  }
                </span>
              </div>
              <div className={classes.wrap}>
                <span className={classes.amountText}>
                  CLT to be rewarded to you today
                </span>
                <span className={classes.amountValue}>
                  {`${userReward} CLT`}
                </span>
              </div>
            </div>
          </Card>
        ) : null}
      </div>
      {status !== 'connected' && (
        <Alert severity="warning">Please, connect your wallet to get started.</Alert>
      )}
    </div>
  )
}

export default Reward