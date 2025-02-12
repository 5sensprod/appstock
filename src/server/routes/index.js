const express = require('express')
const config = require('../config/server.config')
const { getWooConfig } = require('../config/woocommerce')
const WooCommerceAPI = require('@woocommerce/woocommerce-rest-api').default
const CategoryRepository = require('../database/repositories/CategoryRepository')
const CategoryService = require('../services/CategoryService')
const statusRoutes = require('./status')
const v1Routes = require('./v1')
const productImagesRoutes = require('./product-images-routes')
const wooTestRoutes = require('./woo-test-routes')

function initializeRoutes(app, db, sendSseEvent) {
  const router = express.Router()
  const cataloguePath = config.paths.catalogue

  // Route images produits
  router.use('/products/images', productImagesRoutes(cataloguePath))
  router.use('/status', statusRoutes)

  // Utilisation des routes v1
  router.use('/', v1Routes(db, sendSseEvent))

  // Routes API V2
  const wooConfig = getWooConfig()
  const wooCommerceClient = new WooCommerceAPI({
    url: wooConfig.url,
    consumerKey: wooConfig.consumerKey,
    consumerSecret: wooConfig.consumerSecret,
    version: wooConfig.version,
  })

  const categoryRepository = new CategoryRepository(db)
  const categoryService = new CategoryService(
    categoryRepository,
    wooCommerceClient,
  )

  // Test route WooCommerce
  router.use('/v2/woo-test', wooTestRoutes(wooCommerceClient))

  router.use(
    '/v2/categories',
    require('./categories')(categoryService, sendSseEvent),
  )
  router.use('/v2/sync', require('./sync')(categoryService, sendSseEvent))

  app.use('/api', router)
}

module.exports = initializeRoutes
