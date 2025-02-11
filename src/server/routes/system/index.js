const express = require('express')
const router = express.Router()
const serialPortService = require('../../services/SerialPortService')

// Route pour lister les ports série
router.get('/serial-ports', async (req, res) => {
  try {
    const ports = await serialPortService.listPorts()
    res.json({
      timestamp: new Date(),
      ports: ports,
    })
  } catch (error) {
    console.error('Erreur lecture ports série:', error)
    res.status(500).json({
      error: 'Erreur lors de la lecture des ports série',
      details: error.message,
    })
  }
})

module.exports = router
