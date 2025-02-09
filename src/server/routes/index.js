const express = require('express')
const path = require('path')
const config = require('../config/server.config')
const fs = require('fs')
const { getLocalIPv4Address } = require('../networkUtils')

function initializeRoutes(app, db, sendSseEvent) {
  const router = express.Router()
  const cataloguePath = config.paths.catalogue // Ajout explicite du chemin

  // Route images produits
  router.get('/products/images/:productId/:imageName', (req, res) => {
    try {
      const { productId, imageName } = req.params
      console.log('Debug - Paramètres:', {
        productId,
        imageName,
        cataloguePath,
      })

      if (!productId || !imageName || !cataloguePath) {
        console.error('Valeurs manquantes:', {
          productId,
          imageName,
          cataloguePath,
        })
        return res.status(400).send('Paramètres manquants')
      }

      const imagePath = path.join(cataloguePath, productId, imageName)
      console.log('Chemin image:', imagePath)

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

  // Autres routes...
  router.get('/serverStatus', (req, res) => res.json({ status: 'ready' }))
  router.get('/getLocalIp', (req, res) =>
    res.json({ ip: getLocalIPv4Address() }),
  )
  router.get('/config', (req, res) => {
    res.json({
      ip: getLocalIPv4Address(),
      images: {
        basePath: cataloguePath,
        imageUrlPattern: `http://localhost:${config.port}/api/products/images/{id}/{filename}`,
      },
    })
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

  app.use('/api', router)
}

module.exports = initializeRoutes
