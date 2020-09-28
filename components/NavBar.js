import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

import Logo from './Logo'

import AccountButton from './AccountButton'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 5,
    width: '100vw',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px 0 40px'
  },
  leftSide: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  homeLink: {
    marginLeft: theme.spacing(10),
    fontSize: 18,
    color: '#fff',
    textTransform: 'uppercase',
    textDecoration: 'none'
  }
}))

const NavBar = props => {
  const classes = useStyles()

  const { logoMode } = props

  return (
    <div className={classes.root}>
      <div className={classes.leftSide}>
        <a href="https://cexlt.io" target="_blank">
          <Logo mode={logoMode} />
        </a>
        <a href="https://uniswap.info/pair/0x0f1b7d5e235098e9da4ae78199021d7938c77ae6" target="_blank" className={classes.homeLink}>
          Trade for Liquidity Pool
        </a>
      </div>
      <AccountButton />
    </div>
  )
}

NavBar.propTypes = {
  logoMode: PropTypes.string,
}

export default NavBar