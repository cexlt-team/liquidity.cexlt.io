import { makeStyles } from '@material-ui/core/styles'

import NavBar from '../components/NavBar'
import StakeModule from '../components/StakeModule'
import Screen from '../components/Screen'
import Background from '../assets/sub-bg.jpg'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: `url(${Background})`
  }
}))

const App = props => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Screen />
      <NavBar logoMode={'clt'} />
      <StakeModule />
    </div>
  )
}

export default App