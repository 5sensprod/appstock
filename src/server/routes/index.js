const express = require('express')
const path = require('path')
const config = require('../config/server.config')
const fs = require('fs')
const CategoryRepository = require('../../database/repositories/CategoryRepository')
const CategoryService = require('../services/CategoryService')
const wooCommerceService = require('../services/WooCommerceService')
const statusRoutes = require('./status')
const v1Routes = require('./v1')
const v2Routes = require('./v2')

function initializeRoutes(app, db, sendSseEvent) {
  const router = express.Router()
  const cataloguePath = config.paths.catalogue

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
