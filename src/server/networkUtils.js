const os = require('os')

const getLocalIPv4Address = () => {
  const networkInterfaces = os.networkInterfaces()

  for (const netInterface of Object.values(networkInterfaces)) {
    for (const config of netInterface) {
      if (config.family === 'IPv4' && !config.internal) {
        return config.address
      }
    }
  }
  return '127.0.0.1'
}

module.exports = { getLocalIPv4Address }
