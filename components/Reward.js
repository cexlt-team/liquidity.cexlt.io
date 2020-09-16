import Alert from '@material-ui/lab/Alert'

import { useWalletAugmented } from '../lib/WalletProvider'

const Reward = () => {
  const { account } = useWalletAugmented()
  
  return (
    <div>
      <Alert severity="info">Claim all of your rewards from your staked UNI-V2</Alert>
    </div>
  )
}

export default Reward