// src/main/wooManager.js
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default
const { getWooConfig } = require('../config/woocommerce')

let wooApi = null

const initializeWooCommerce = () => {
  try {
    const config = getWooConfig()

    if (!config.url || !config.consumerKey || !config.consumerSecret) {
      console.error('Configuration WooCommerce manquante')
      return false
    }

    wooApi = new WooCommerceRestApi({
      url: config.url,
      consumerKey: config.consumerKey,
      consumerSecret: config.consumerSecret,
      version: config.version,
      queryStringAuth: true,
    })

    return true
  } catch (error) {
    console.error("Erreur d'initialisation WooCommerce:", error)
    return false
  }
}

const getApi = () => {
  if (!wooApi && !initializeWooCommerce()) {
    return null
  }
  return wooApi
}

const testConnection = async () => {
  try {
    const api = getApi()
    if (!api) {
      return {
        success: false,
        message:
          'Veuillez configurer vos identifiants WooCommerce dans les paramètres',
      }
    }

    const response = await api.get('products', { per_page: 1 })
    return {
      success: true,
      message: 'Connexion établie avec succès',
    }
  } catch (error) {
    console.error('Erreur de connexion:', error)
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    }
  }
}

module.exports = {
  initializeWooCommerce,
  getApi,
  testConnection,
}
