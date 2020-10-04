import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'

import { useWalletAugmented } from '../lib/WalletProvider'
import { rewardAdmin } from '../lib/Contracts'
import Stake from './Stake'
import Withdraw from './Withdraw'
import Reward from './Reward'
import Transfer from './Transfer'

const TabPanel = props => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

const a11yProps = index => {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}

const StakeModule = () => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [tab, setTab] = useState(0)
  const { account, status } = useWalletAugmented()

  const handleTab = (event, newValue) => {
    setTab(newValue)
  }

  useEffect(() => {
    if (status === 'disconnected') {
      setIsAdmin(false)
      if (tab === 3) {
        setTab(0)
      }
    } else if (status === 'connected') {
      if (account === rewardAdmin) {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
      }
    }
  })

  return (
    <Container maxWidth="md">
      <Paper elevation={3}>
        <Tabs
          value={tab}
          onChange={handleTab}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Stake" {...a11yProps(0)} />
          <Tab label="Withdraw" {...a11yProps(1)} />
          <Tab label="Claim Rewards" {...a11yProps(2)} />
          {isAdmin ? (
            <Tab label="Reward Trasnsfer" {...a11yProps(3)} />
          ) : null}
        </Tabs>
        <div>
          <TabPanel value={tab} index={0}>
            <Stake />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <Withdraw />
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <Reward />
          </TabPanel>
          {isAdmin ? (
            <TabPanel value={tab} index={3}>
              <Transfer />
            </TabPanel>
          ) : null}
        </div>
      </Paper>
    </Container>
  )
}

export default StakeModule