'use strict'

module.exports = {
  development: {
    accessKeyId: process.env.S3_ACCESS_ID,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_REGION,
    apiVersion: process.env.S3_VERSION
  },
  production: {
    accessKeyId: process.env.S3_ACCESS_ID,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_REGION,
    apiVersion: process.env.S3_VERSION
  }
}