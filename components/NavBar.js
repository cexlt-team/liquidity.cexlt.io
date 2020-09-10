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
  }
}))

const NavBar = props => {
  const classes = useStyles()

  const { logoMode } = props

  return (
    <div className={classes.root}>
      <Logo mode={logoMode} />
      <AccountButton />
    </div>
  )
}

NavBar.propTypes = {
  logoMode: PropTypes.string,
}

export default NavBar