const express = require('express')

module.exports = (db, sendSseEvent) => {
  const router = express.Router()

  router.use('/users', require('./usersRoutes')(db))
  router.use('/products', require('./productsRoutes')(db, sendSseEvent))
  router.use('/categories', require('./categoriesRoutes')(db, sendSseEvent))
  router.use('/invoices', require('./invoicesRoutes')(db, sendSseEvent))
  router.use('/quotes', require('./quotesRoutes')(db, sendSseEvent))
  router.use('/tickets', require('./ticketsRoutes')(db, sendSseEvent))
  router.use('/suppliers', require('./suppliersRoutes')(db, sendSseEvent))
  router.use('/print', require('./printRoutes'))

  return router
}
