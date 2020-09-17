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
  '@keyframes byteAnimaion': {
    '0%': {
      opacity: 0,
      left: 80
    },
    '4%': {
      opacity: 1
    },
    '46%': {
      opacity: 1
    },
    '50%': {
      opacity: 0,
      left: 185
    },
    '54%': {
      opacity: 1
    },
    '96%': {
      opacity: 1
    },
    '100%': {
      opacity: 0,
      left: 80
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
  },
  box: {
    width: 240,
    height: 55,
    position: 'relative'
  },
  comp: {
    position: 'absolute',
    top: 0,
    width: 80,
    height: 55,
    border: '3px solid #fff',
    borderRadius: 5,
    '&:after': {
      content: '""',
      position: 'absolute',
      zIndex: 5,
      top: 19,
      left: 5,
      width: 65,
      height: 10,
      borderRadius: 360,
      border: '3px solid #fff'
    }
  },
  loader: {
    position: 'absolute',
    zIndex: 5,
    top: 24,
    left: 10,
    width: 8,
    height: 8,
    borderRadius: 360,
    background: '#fff',
    animation: '$loader 5s infinite linear 0.5s',
  },
  con: {
    position: 'absolute',
    top: 28,
    left: 85,
    width: 100,
    height: 3,
    background: '#fff'
  },
  byte: {
    position: 'absolute',
    top: 25,
    left: 80,
    height: 9,
    width: 9,
    background: '#fff',
    borderRadius: 360,
    zIndex: 6,
    opacity: 0,
    animation: '$byteAnimaion 5s infinite linear 0.5s'
  },
  server: {
    position: 'absolute',
    top: 22,
    left: 185,
    width: 35,
    height: 35,
    zIndex: 1,
    border: '3px solid #fff',
    background: '#459BF9',
    borderRadius: 360,
    transform: 'rotateX(58deg)',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: '-47px',
      left: '-3px',
      width: 35,
      height: 35,
      zIndex: 20,
      border: '3px solid #fff',
      background: '#459BF9',
      borderRadius: 360
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      top: '-26px',
      left: '-3px',
      borderLeft: '3px solid #fff',
      borderRight: '3px solid #fff',
      width: 35,
      height: 40,
      zIndex: 17,
      background: '#459BF9'
    }
  }
}))

const Loader = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.text}>
        PENDING TRANSACTION
      </div>
      <div className={classes.box}>
        <div className={classes.comp}></div>
        <div className={classes.loader}></div>
        <div className={classes.con}></div>
        <div className={classes.byte}></div>
        <div className={classes.server}></div>
      </div>
    </div>
  )
}

export default Loader