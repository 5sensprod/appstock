// src/server/services/WooCommerceService.js
const WooCommerceAPI = require('@woocommerce/woocommerce-rest-api').default
const config = require('../config')

class WooCommerceService {
  constructor() {
    const wooConfig = config.woocommerce.getWooConfig()
    this.client = new WooCommerceAPI({
      url: wooConfig.url,
      consumerKey: wooConfig.consumerKey,
      consumerSecret: wooConfig.consumerSecret,
      version: wooConfig.version,
    })
  }

  getClient() {
    return this.client
  }
}

module.exports = new WooCommerceService()
