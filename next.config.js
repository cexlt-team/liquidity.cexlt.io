const path = require('path')
const withImages = require('next-images')

module.exports = withImages({
  webpack(config, options) {
    return ['lib', 'components'].reduce((config, dirname) => {
      config.resolve.alias[dirname] = path.join(__dirname, dirname)
      return config
    }, config)
  }
})
    
