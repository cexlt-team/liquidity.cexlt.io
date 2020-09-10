import { useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Popover from '@material-ui/core/Popover'
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'

import { useWalletAugmented } from '../lib/WalletProvider'
import { shortenAddress } from '../utils/web3-utils'

import fortmatic from './svg/fortmatic.svg'
import frame from './svg/frame.svg'
import metamask from './svg/metamask.svg'
import portis from './svg/portis.svg'

import EthIdenticon from './EthIdenticon'

const useStyles = makeStyles(theme => ({
  fromWrap: {
    display: 'grid',
    gridGap: 10,
    gridAutoFlow: 'row',
    gridTemplateColumns: 'repeat(2, 1fr)',
    padding: 16
  },
  fromText: {
    borderBottom: '0.5px solid #dde4e8',
    color: '#7893ae',
    paddingBottom: theme.spacing(2)
  },
  providerButton: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    color: '#1c1c1c',
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
    height: 90,
    marginBottom: 12,
    textTransform: 'capitalize',
    cursor: 'pointer',
    boxShadow: '0px 5px 12px rgba(139, 166, 194, 0.35)',
    borderRadius: 8
  },
  providerName: {
    fontSize: 16,
    marginTop: 8
  },
  connectedContainer: {
    display: 'flex',
    height: 40
  },
  connectedButton: {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'normal',
    cursor: 'pointer',
    width: 178,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)'
  },
  identicon: {
    position: 'relative'
  },
  address: {
    fontSize: 14,
    lineHeight: '31px',
    color: '#1c1c1c',
    paddingLeft: 8,
    paddingRight: 4
  }
}))

const Disconnected = () => {
  const classes = useStyles()

  const { activate } = useWalletAugmented()

  const activateAndTrack = useCallback(async providerId => {
    try {
      await activate(providerId)
    } catch (error) {
      console.log(error)
    }
  }, [activate])

  const containerRef = useRef()

  return (
    <PopupState variant="popover" popupId="demo-popup-popover" ref={containerRef}>
      {(popupState) => (
        <div>
          <Button variant="contained" color="primary" {...bindTrigger(popupState)}>
            Connect Account
          </Button>
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Box p={2}>
              <Typography className={classes.fromText}>Use Account From</Typography>
              <div className={classes.fromWrap}>
                <ProviderButton
                  name="Metamask"
                  onActivate={() => activateAndTrack('injected')}
                  image={metamask}
                />
                <ProviderButton
                  name="Frame"
                  onActivate={() => activateAndTrack('frame')}
                  image={frame}
                />
                <ProviderButton
                  name="Fortmatic"
                  onActivate={() => activateAndTrack('fortmatic')}
                  image={fortmatic}
                />
                <ProviderButton
                  name="Portis"
                  onActivate={() => activateAndTrack('portis')}
                  image={portis}
                />
              </div>
            </Box>
          </Popover>
        </div>
      )}
    </PopupState>
  )
}

const Connected = () => {
  const classes = useStyles()

  const { account, reset } = useWalletAugmented()

  const containerRef = useRef()

  return (
    <div className={classes.connectedContainer} ref={containerRef}>
      <Box p={2} className={classes.connectedButton} onClick={reset}>
        <div className={classes.identicon}>
          <EthIdenticon address={account} scale={1} radius={4} soften={0.3} />
        </div>
        <div className={classes.address}>
          {shortenAddress(account)}
        </div>
      </Box>
    </div>
  )
}

const ProviderButton = props => {
  const classes = useStyles()

  const { name, onActivate, image } = props

  return (
    <Box p={2} className={classes.providerButton} onClick={onActivate}>
      <img src={image} alt="" height="42px" />
      <div className={classes.providerName}>
        {name}
      </div>
    </Box>
  )
}

ProviderButton.propTypes = {
  name: PropTypes.string,
  onActivate: PropTypes.func,
  image: PropTypes.string
}

const AccountButton = () => {
  const { account } = useWalletAugmented()
  return account ? <Connected /> : <Disconnected />
}

export default AccountButton