import PropTypes from 'prop-types'
import Blockies from 'react-blockies'
import { makeStyles } from '@material-ui/core/styles'

import { isAddress } from '../utils/web3-utils'

const PX_RATIO = typeof devicePixelRatio === 'undefined' ? 2 : devicePixelRatio
const BLOCKIES_SQUARES = 8
const BASE_SCALE = 3

const EthIdenticon = props => {
  const { address, scale, radius, soften } = props

  const blockiesScale = scale * BASE_SCALE

  const useStyles = makeStyles(theme => ({
    main: {
      display: 'inline-flex',
      verticalAlign: 'middle',
      overflow: 'hidden',
      width: BLOCKIES_SQUARES * blockiesScale,
      height: BLOCKIES_SQUARES * blockiesScale,
      borderRadius: radius,
      maskImage: 'linear-gradient(red, red)'
    },
    scaling: {
      display: 'flex',
      width: BLOCKIES_SQUARES * blockiesScale * PX_RATIO,
      height: BLOCKIES_SQUARES * blockiesScale * PX_RATIO,
      background: '#fff',
      transform: `scale(${1 / PX_RATIO}, ${1 / PX_RATIO})`,
      transformOrigin: '0 0'
    },
    opacity: {
      opacity: 1 - soften
    }
  }))

  const classes = useStyles()

  return isAddress(address) ? (
      <div className={classes.main}>
        <div className={classes.scaling}>
          <div className={classes.opacity}>
            <Blockies
              seed={address.toLowerCase()}
              size={BLOCKIES_SQUARES}
              scale={blockiesScale * PX_RATIO}
            />
          </div>
        </div>
      </div>
    ) : null
}

EthIdenticon.propTypes = {
  address: PropTypes.string.isRequired,
  scale: PropTypes.number,
  radius: PropTypes.number,
  soften: PropTypes.number
}

export default EthIdenticon