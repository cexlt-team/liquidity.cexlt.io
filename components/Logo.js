import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useTransition, animated } from 'react-spring'
import { makeStyles } from '@material-ui/core/styles'

import logoClt from './svg/wave-logo.svg'
import logoUni from './svg/uniswap.svg'

const useStyles = makeStyles(theme => ({
  button: {
    position: 'relative',
    display: 'flex',
    width: 68,
    height: 68,
    padding: 0,
    whiteSpace: 'nowrap',
    border: 0,
    cursor: 'pointer',
    outline: '0 !important',
    background: 'transparent',
    '&::-moz-focus-inner': {
      border: 0
    },
    '&:active': {
      transform: 'translateY(1px)'
    }
  },
  animate: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%'
  }
}))

const getImage = mode => {
  if (mode === 'clt') {
    return logoClt
  }

  if (mode === 'uni') {
    return logoUni
  }
}

const Logo = props => {
  const classes = useStyles()

  const { label, onClick, mode, mini } = props

  const animate = useRef(false)
  useEffect(() => {
    animate.current = true
  }, [])

  const modeTransition = useTransition(mode, null, {
    immediate: !animate.current,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: {
      mass: 0.1,
      tension: 120,
      friction: 14,
    }
  })

  return (
    <button className={classes.button}>
      {modeTransition.map(({ item: mode, key, props: { opacity } }) => (
        <animated.img
          key={key}
          alt={label}
          src={getImage(mode)}
          style={{ opacity }}
          className={classes.animate}
        />
      ))}
    </button>
  )
}

Logo.propTypes = {
  label: PropTypes.string,
  mode: PropTypes.oneOf(['clt', 'uni']),
  onClick: PropTypes.func,
}

export default Logo