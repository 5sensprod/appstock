// src/server/services/WooCommerceService.js
const WooCommerceAPI = require('@woocommerce/woocommerce-rest-api').default
const { getWooConfig } = require('../config/woocommerce')

class WooCommerceService {
  constructor() {
    const config = getWooConfig()
    this.client = new WooCommerceAPI({
      url: config.url,
      consumerKey: config.consumerKey,
      consumerSecret: config.consumerSecret,
      version: config.version,
    })
  }

  // Pour accéder au client WooCommerce directement si nécessaire
  getClient() {
    return this.client
  }
}

module.exports = new WooCommerceService()
