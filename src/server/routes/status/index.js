const express = require('express')
const statusRoutes = require('./statusRoutes')

const router = express.Router()
router.use('/', statusRoutes)

module.exports = router
