const express = require('express')
const path = require('path')
const config = require('../config/server.config')
const fs = require('fs')
const { getWooConfig } = require('../config/woocommerce')
const WooCommerceAPI = require('@woocommerce/woocommerce-rest-api').default
const CategoryRepository = require('../database/repositories/CategoryRepository')
const CategoryService = require('../services/CategoryService')
const statusRoutes = require('./status')
const v1Routes = require('./v1')
const productImagesRoutes = require('./product-images-routes')

function initializeRoutes(app, db, sendSseEvent) {
  const router = express.Router()
  const cataloguePath = config.paths.catalogue

  // Route images produits
  router.use('/products/images', productImagesRoutes(cataloguePath))

  router.use('/status', statusRoutes)

  // test get woo cat
  router.get('/v2/woo-test', async (req, res) => {
    try {
      const response = await wooCommerceClient.get('products/categories')
      res.json({
        success: true,
        message: 'Connexion WooCommerce réussie',
        categories: response.data,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur de connexion WooCommerce',
        error: error.response ? error.response.data : error.message,
      })
    }
  })

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

  router.use(
    '/v2/categories',
    require('./categories')(categoryService, sendSseEvent),
  )
  router.use('/v2/sync', require('./sync')(categoryService, sendSseEvent))

  app.use('/api', router)
}

module.exports = initializeRoutes
