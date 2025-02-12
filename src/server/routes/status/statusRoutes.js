const express = require('express')
const { getLocalIPv4Address } = require('../../utils/networkUtils')

const router = express.Router()

router.get('/serverStatus', (req, res) => res.json({ status: 'ready' }))
router.get('/getLocalIp', (req, res) => res.json({ ip: getLocalIPv4Address() }))

module.exports = router
