const express = require('express')

module.exports = (wooCommerceClient) => {
  const router = express.Router()

  router.get('/', async (req, res) => {
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

  return router
}
