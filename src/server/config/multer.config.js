// src/server/config/multer.config.js
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const config = require('./server.config')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const productId = req.params.productId
    const productFolderPath = path.join(config.paths.catalogue, productId)
    if (!fs.existsSync(productFolderPath)) {
      fs.mkdirSync(productFolderPath, { recursive: true })
    }
    cb(null, productFolderPath)
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase()
    if (config.upload.allowedTypes.includes(extension)) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(null, file.fieldname + '-' + uniqueSuffix + extension)
    } else {
      cb(new Error('Type de fichier non autorisé'), null)
    }
  },
})

module.exports = multer({
  storage,
  limits: { fileSize: config.upload.maxSize },
})
