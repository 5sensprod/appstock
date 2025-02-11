const express = require('express')
const router = express.Router()

function syncRoutes(categoryService, sendSseEvent) {
  // Synchroniser depuis WooCommerce vers la base locale
  router.post('/from-woo', async (req, res) => {
    try {
      await categoryService.syncFromWooCommerce()
      sendSseEvent('sync', {
        type: 'categories',
        action: 'syncFromWoo',
        success: true,
      })
      res.json({
        success: true,
        message: 'Synchronisation depuis WooCommerce réussie',
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  // Synchroniser une catégorie vers WooCommerce
  router.post('/to-woo/:id', async (req, res) => {
    try {
      await categoryService.pushToWooCommerce(req.params.id)
      sendSseEvent('sync', {
        type: 'category',
        action: 'pushToWoo',
        categoryId: req.params.id,
      })
      res.json({
        success: true,
        message: 'Catégorie synchronisée vers WooCommerce',
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  return router
}

module.exports = syncRoutes
