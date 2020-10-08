import { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import Button from '@material-ui/core/Button'
import { DataGrid } from '@material-ui/data-grid'

import { useWalletAugmented } from '../lib/WalletProvider'
import { rewardAdmin } from '../lib/Contracts'

const useStyles = makeStyles(theme => ({
  
}))

const columns = [
  { field: 'address', headerName: 'Address', width: 432 },
  { 
    field: 'reward_sum',
    headerName: 'Reward Sum',
    width: 432,
    valueFormatter: (params) => {
      return Number(params.value).toLocaleString('en', {'minimumFractionDigits':0, 'maximumFractionDigits':18})
    }
  }
]

const parseAddresses = json => {
  return new Promise((res, rej) => {
    json.forEach((account, index) => {
      if (Object.keys(aacount).length === 0) {
        rej({ message: `There was an error parsing ${JSON.stringify(account)} at line ${index}` })
      }

      const address = Object.keys(account)[0].replace(/\s/g, '')

                      
    })
  })
}

const Transfer = () => {
  const [showApprove, setShowApprove] = useState(false)
  const [showStake, setShowStake] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [rewardData, setRewardData] = useState([])
  const [step, setStep] = useState('approve')

  const { account, status } = useWalletAugmented()

  const handleSubmit = async () => {
    setDisabled(true)

    try {
      if (step === 'approve') {
        let dataString = ''
        rewardData.map((item, index) => {
          if (index === 0) {
            dataString += '['
          }

          dataString += `{ "${item.address}":"${Number(item.reward_sum)}" }`
          if (index < rewardData.length - 1) {
            dataString += ','
          } else {
            dataString += ']'
          }
        })
        console.log(dataString)
        const dataJson = JSON.parse(dataString)
        console.log(dataJson) 
      }

      if (step === 'transfer') {
        
      }
    } catch (error) {
      
    }
  }

  useEffect(() => {
    const getRewardList = async () => {
      const url = 'https://liquidity.cexlt.io/api/reward'

      try {
        const rewardApi = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
        })

        const result = await rewardApi.json()
        setRewardData(result.data.row)
      } catch (error) {
        console.error('Error:', error)
      }
    }
    
    if (status === 'connected') {
      getRewardList()
    }
  }, [])

  return (
    <div>
      <div style={{ height: 350, width: '100%' }}>
        <DataGrid
          rows={rewardData}
          columns={columns}
          rowHeight={25}
          pageSize={25}
        />
      </div>
      {status !== 'connected' && account === rewardAdmin ? (
        <Alert severity="warning">Please, connect your wallet to get started.</Alert>
      ) : (
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={disabled}
          onClick={disabled ? undefined : handleSubmit}
          fullWidth
        >
          {step === 'approve' ? 'Approve' : 'Transfer'}
        </Button>
      )}
    </div>
  )
}

export default Transfer
