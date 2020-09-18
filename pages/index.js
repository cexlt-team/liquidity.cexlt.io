import { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'

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
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const now = moment.utc()
    const startDate = moment.utc([2020, 8, 18, 12])

    if (now >= startDate) {
      setOpen(true)
    }
  })

  return (
    <div className={classes.root}>
      {!open && (<Screen />)}
      <NavBar logoMode={'clt'} />
      <StakeModule />
    </div>
  )
}

export default App