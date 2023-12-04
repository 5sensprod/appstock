const os = require('os')

const getLocalIPv4Address = () => {
  const networkInterfaces = os.networkInterfaces()
  console.log('Network Interfaces:', networkInterfaces) // Log pour le débogage

  for (const netInterface of Object.values(networkInterfaces)) {
    for (const config of netInterface) {
      if (config.family === 'IPv4' && !config.internal) {
        console.log('Found Local IP:', config.address) // Log pour le débogage
        return config.address
      }
    }
  }
  return '127.0.0.1'
}

module.exports = { getLocalIPv4Address }
