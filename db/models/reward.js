'use strict'

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('reward', {
    address: {
      type: DataTypes.TEXT
    },
    stake: {
      type: DataTypes.DECIMAL
    },
    rate: {
      type: DataTypes.DECIMAL
    },
    reward: {
      type: DataTypes.DECIMAL
    }
  }, {
    timestamps: true
  })
}