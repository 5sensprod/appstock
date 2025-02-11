const express = require('express')

module.exports = (categoryService, sendSseEvent) => {
  const router = express.Router()

  router.use(
    '/categories',
    require('./categories')(categoryService, sendSseEvent),
  )
  router.use('/sync', require('./sync')(categoryService, sendSseEvent))

  return router
}
