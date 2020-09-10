import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          fontFamily: '"Alata", sans-serif'
        }
      }
    },
    MuiButton: {
      root: {
        fontFamily: '"Alata", sans-serif'
      }
    },
    MuiTab: {
      root: {
        fontFamily: '"Alata", sans-serif'
      }
    },
    MuiAlert: {
      root: {
        fontFamily: '"Alata", sans-serif'
      }
    }
  },
  palette: {
    type: 'light'
  }
})

export default theme