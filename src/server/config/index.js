// src/server/config/index.js
const serverConfig = require('./server.config')
const woocommerceConfig = require('./woocommerce')
const multerConfig = require('./multer.config')

module.exports = {
  server: serverConfig,
  woocommerce: woocommerceConfig,
  upload: multerConfig,
}
