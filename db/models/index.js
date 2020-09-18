import { Sequelize } from 'sequelize'

import Config from '../config'

const env = process.env.NODE_ENV || 'development'
const config = Config[env]

const db = {}

const sequelize = new Sequelize(config)

db.sequelize = sequelize
db.Sequelize = Sequelize

db.Reward = require('./reward')(sequelize, Sequelize)

module.exports = db
