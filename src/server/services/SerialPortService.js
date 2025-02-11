//src\server\services\SerialPortService.js
const { SerialPort } = require('serialport')

class SerialPortService {
  async listPorts() {
    try {
      const ports = await SerialPort.list()
      return ports.map((port) => ({
        path: port.path,
        manufacturer: port.manufacturer,
        serialNumber: port.serialNumber,
        vendorId: port.vendorId,
        productId: port.productId,
        pnpId: port.pnpId,
      }))
    } catch (error) {
      console.error('Erreur liste ports série:', error)
      throw error
    }
  }
}

module.exports = new SerialPortService()
