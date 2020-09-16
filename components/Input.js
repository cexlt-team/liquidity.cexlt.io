import { useState, useEffect, useCallback, useRef, forwardRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import uniswapSvg from './svg/uniswap.svg'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  inputWrap: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    height: 50,
    margin: '16px 0 20px 0',
    background: '#fff',
    display: 'flex',
    padding: 0
  },
  disabledOpacity: {
    opacity: '0.5'
  },
  opacity: {
    opacity: '1'
  },
  input: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    height: 69,
    padding: '6px 12px 0',
    background: '#fff',
    border: '1px solid #dde4e9',
    color: '#212b36',
    boxSizing: 'border-box',
    boxShadow: 'inset 0px 4px 8px rgba(139, 166, 194, 0.35)',
    borderRadius: 8,
    appearance: 'none',
    fontSize: '20px',
    fontWeight: 400,
    '&:focus': {
      outline: 'none',
      borderColor: '#08bee5'
    },
    '&::placeholder': {
      color: '#8fa4b5',
      opacity: 1
    },
    '&:invalid': {
      boxShadow: 'none'
    }
  },
  button: {
    position: 'absolute',
    right: 0,
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 69,
    width: 150,
    padding: '0 0 0 10px',
    color: '#212b36',
    background: 'transparent',
    borderWidth: 0,
    borderRadius: '0 4px 4px 0',
    outline: 0,
    transition: 'none',
    '&::-moz-focus-inner': {
      border: 0
    },
    '&:focus': {
      outline: 0
    },
    '&:focus:after': {
      content: ''
    }
  },
  buttonCursor: {
    cursor: 'pointer'
  },
  disabledCursor: {
    cursor: 'auto'
  },
  adorWrap: {
    position: 'relative'
  },
  wrapAcitve: {
    top: 1
  },
  wrapDisabled: {
    top: 0
  }
}))

const Input = ({
  disabled = true,
  inputValue,
  onBlur = null,
  onChange = null,
  onFocus = null,
  onMax = null,
  placeholder = 'Enter amount',
}) => {
  const classes = useStyles()
  const [opened, setOpened] = useState(false)
  const buttonRef = useRef()
  const menuRef = useRef()
  const inputRef = useRef()

  useEffect(() => {
    if (opened && menuRef.current) {
      menuRef.current.focus()
    }
  }, [opened])

  const handleButtonClick = useCallback(() => {
    setOpened(isOpen => !isOpen)
  }, [])

  return (
    <div className={classes.root}>
      <div className={disabled ? clsx(classes.inputWrap, classes.disabledOpacity) : clsx(classes.inputWrap, classes.opacity)}>
        <input
          disabled={disabled}
          ref={inputRef}
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
          placeholder={placeholder}
          value={!disabled ? inputValue : ''}
          className={classes.input}
        />
        <DropdownButton
          disabled={disabled}
          ref={buttonRef}
          onClick={handleButtonClick}
          onMax={onMax}
          opened={opened}
        />
      </div>
    </div>
  )
}

const DropdownButton = forwardRef(function DropdownButton({ disabled, onMax, onClick }, ref) {
  const classes = useStyles()

  return (
    <button
      ref={ref}
      onClick={onClick}
      type="button"
      className={disabled ? clsx(classes.button, classes.disabledCursor) : clsx(classes.button, classes.buttonCursor)}
    >
      <div
        onClick={disabled ? undefined : onMax} 
        className={disabled ? clsx(classes.adorWrap, classes.wrapDisabled) : clsx(classes.adorWrap, classes.wrapAcitve)}
      >
        <Adornment />
      </div>
    </button>
  )
})

const Adornment = () => {
  return (
    <div>
      <img src={uniswapSvg} alt="Token Logo" width={36} />
      <span>MAX</span>
    </div>
  )
}

export default Input