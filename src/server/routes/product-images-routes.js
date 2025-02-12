const express = require('express')
const path = require('path')
const fs = require('fs')

module.exports = (cataloguePath) => {
  const router = express.Router()

  // Route pour obtenir une image spécifique
  router.get('/:productId/:imageName', (req, res) => {
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

  // Route pour lister toutes les photos d'un produit
  router.get('/:productId/photos', (req, res) => {
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

  return router
}
