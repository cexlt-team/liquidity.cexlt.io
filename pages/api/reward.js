import Cors from 'cors'
import { Sequelize } from 'sequelize'

import Config from '../../db/config'

const env = process.env.NODE_ENV || 'development'
const config = Config[env]

import initMiddleware from '../../lib/init-middleware'
import { Reward } from '../../db/models'

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST'],
  })
)

const sequelize = new Sequelize(config)

export default async (req, res) => {
  await cors(req, res)
  const { method, body } = req
  console.log(body)

  switch (method) {
    case 'GET':
      const getResult = await Reward.findAll({
        attributes: [
          'id',
          'address',
          [sequelize.fn('SUM', sequelize.col('reward')), 'reward_sum']
        ],
        group: 'address',
        raw: true
      })
      res.status(200).json({ data: { count: getResult.length, row: getResult }})
      break
    case 'POST':
      const result = await Reward.sum('reward', { where: { address: body.address }})
      console.log(result)
      res.status(200).json({ data: result })
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}