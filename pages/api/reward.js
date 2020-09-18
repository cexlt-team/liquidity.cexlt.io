import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'
import { Reward } from '../../db/models'

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST'],
  })
)

export default async (req, res) => {
  await cors(req, res)
  const { method, body } = req

  switch (method) {
    case 'GET':
      res.status(200).json({ success: 'This is reward query api' })
      break
    case 'POST':
      const result = await Reward.sum('reward', { where: { address: body.address }})
      res.status(200).json({ data: result })
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}