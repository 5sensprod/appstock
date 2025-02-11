const express = require('express')
const fileService = require('../services/FileService')
const CategoryRepository = require('../database/repositories/CategoryRepository')
const CategoryService = require('../services/CategoryService')
const wooCommerceService = require('../services/WooCommerceService')
const statusRoutes = require('./status')
const v1Routes = require('./v1')
const v2Routes = require('./v2')

function initializeRoutes(app, db, sendSseEvent) {
  const router = express.Router()

  // Route images produits
  router.get('/products/images/:productId/:imageName', (req, res) => {
    try {
      const { productId, imageName } = req.params
      const imagePath = fileService.getProductImage(productId, imageName)
      res.sendFile(imagePath)
    } catch (error) {
      console.error('Erreur:', error)
      res
        .status(error.message === 'Image non trouvée' ? 404 : 500)
        .send(error.message)
    }
  })

  app.get('/api/products/:productId/photos', (req, res) => {
    try {
      const { productId } = req.params
      const photos = fileService.getProductPhotos(productId)
      res.json(photos)
    } catch (error) {
      console.error('Erreur lecture photos:', error)
      res.status(500).json({ error: error.message })
    }
  })

  // Routes API
  router.use('/status', statusRoutes)
  router.use('/', v1Routes(db, sendSseEvent))

  // Initialisation des services pour l'API V2
  const categoryRepository = new CategoryRepository(db)
  const categoryService = new CategoryService(
    categoryRepository,
    wooCommerceService.getClient(),
  )

  router.use('/v2', v2Routes(categoryService, sendSseEvent))
  app.use('/api', router)
}

module.exports = initializeRoutes
