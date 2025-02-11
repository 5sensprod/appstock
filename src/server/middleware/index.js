const express = require('express')
const cors = require('cors')
const multer = require('multer')
const config = require('../config')

function initializeMiddleware(app) {
  // Middlewares de base
  app.use(express.json())
  app.use(express.static(config.server.paths.static))
  app.use(cors(config.server.cors))

  // Middleware catalogue
  app.use('/catalogue', express.static(config.server.paths.catalogue))

  // Gestion des erreurs Multer
  app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          error: `Fichier trop volumineux. Maximum: ${config.server.upload.maxSize / 1024 / 1024}MB`,
        })
      }
      return res.status(400).json({ error: error.message })
    }
    next(error)
  })

  return app
}

module.exports = initializeMiddleware
