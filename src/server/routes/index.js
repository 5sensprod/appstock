const express = require('express')
const path = require('path')
const config = require('../config/server.config')
const fs = require('fs')
const { getWooConfig } = require('../config/woocommerce')
const WooCommerceAPI = require('@woocommerce/woocommerce-rest-api').default
const CategoryRepository = require('../database/repositories/CategoryRepository')
const CategoryService = require('../services/CategoryService')
const statusRoutes = require('./status')

function initializeRoutes(app, db, sendSseEvent) {
  const router = express.Router()
  const cataloguePath = config.paths.catalogue // Ajout explicite du chemin

  // Route images produits
  router.get('/products/images/:productId/:imageName', (req, res) => {
    try {
      const { productId, imageName } = req.params

      if (!productId || !imageName || !cataloguePath) {
        console.error('Valeurs manquantes:', {
          productId,
          imageName,
          cataloguePath,
        })
        return res.status(400).send('Paramètres manquants')
      }

      const imagePath = path.join(cataloguePath, productId, imageName)

      if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath)
      } else {
        res.status(404).send('Image non trouvée')
      }
    } catch (error) {
      console.error('Erreur:', error)
      res.status(500).send(error.message)
    }
  })

  app.get('/api/products/:productId/photos', (req, res) => {
    const { productId } = req.params
    const productDir = path.join(cataloguePath, productId)

    if (!fs.existsSync(productDir)) {
      return res.json([])
    }

    try {
      const files = fs.readdirSync(productDir)
      const photos = files.filter((file) => {
        const ext = path.extname(file).toLowerCase()
        return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
      })
      res.json(photos)
    } catch (error) {
      console.error('Erreur lecture photos:', error)
      res.status(500).json({ error: error.message })
    }
  })

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

  // Routes API
  router.use('/users', require('./usersRoutes')(db))
  router.use('/products', require('./productsRoutes')(db, sendSseEvent))
  router.use('/categories', require('./categoriesRoutes')(db, sendSseEvent))
  router.use('/invoices', require('./invoicesRoutes')(db, sendSseEvent))
  router.use('/quotes', require('./quotesRoutes')(db, sendSseEvent))
  router.use('/tickets', require('./ticketsRoutes')(db, sendSseEvent))
  router.use('/suppliers', require('./suppliersRoutes')(db, sendSseEvent))
  router.use('/print', require('./printRoutes'))

  // Routes API V2
  // Initialisation API WooCommerce et services pour nouvelle version
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
