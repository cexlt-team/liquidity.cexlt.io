import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  '@keyframes fadeInOut': {
    '0%': {
      opacity: 1
    },
    '50%': {
      opacity: 0
    },
    '100%': {
      opacity: 1
    }
  },
  '@keyframes loader': {
    '0%': {
      width: 8
    },
    '100%': {
      width: 63
    }
  },
  root: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,.53)',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 99
  },
  text: {
    color: '#fff',
    fontWeight: 300,
    fontSize: '45px',
    opacity: 1,
    animation: '$fadeInOut 2.5s infinite',
    marginBottom: theme.spacing(4)
  }
}))

const Screen = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.text}>
        OPEN at 09-18-2020 12:00 GMT+0
      </div>
    </div>
  )
}

export default Screen