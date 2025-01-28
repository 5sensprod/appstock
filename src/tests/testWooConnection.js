// src/tests/testWooConnection.js
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default
require('dotenv').config()

async function testWooConnection() {
  const api = new WooCommerceRestApi({
    url: process.env.WOOCOMMERCE_URL,
    consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
    consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
    version: 'wc/v3',
    queryStringAuth: true, // Utile pour le débogage
  })

  try {
    console.log('Test de connexion à WooCommerce...')
    console.log('URL:', process.env.WOOCOMMERCE_URL)

    const response = await api.get('products', { per_page: 1 })
    console.log('Connexion réussie!')
    console.log('Nombre total de produits:', response.headers['x-wp-total'])
    return true
  } catch (error) {
    console.error('Erreur de connexion:', error.message)
    if (error.response) {
      console.error('Détails:', error.response.data)
    }
    throw error
  }
}

// Exécuter le test
testWooConnection()
  .then(() => console.log('Test terminé avec succès'))
  .catch(() => console.log('Test échoué'))
