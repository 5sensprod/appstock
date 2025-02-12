const multer = require('multer')
const path = require('path')
const fs = require('fs')
const config = require('./server.config')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath

    if (req.params.productId) {
      uploadPath = path.join(config.paths.catalogue, req.params.productId)
    } else if (req.params.id) {
      uploadPath = path.join(
        config.paths.catalogue,
        'categories',
        req.params.id,
      )
    } else {
      return cb(new Error('ID de produit ou de catégorie requis'), null)
    }

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase()
    if (!config.upload.allowedTypes.includes(extension)) {
      return cb(new Error('Type de fichier non autorisé'), null)
    }
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`)
  },
})

module.exports = multer({
  storage,
  limits: { fileSize: config.upload.maxSize },
})
