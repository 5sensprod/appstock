// src/server/services/FileService.js
const path = require('path')
const fs = require('fs')
const config = require('../config')

class FileService {
  constructor(cataloguePath) {
    this.cataloguePath = cataloguePath
  }

  // Gestion des images produits
  getProductImage(productId, imageName) {
    if (!productId || !imageName || !this.cataloguePath) {
      throw new Error('Paramètres manquants')
    }

    const imagePath = path.join(this.cataloguePath, productId, imageName)
    if (!fs.existsSync(imagePath)) {
      throw new Error('Image non trouvée')
    }

    return imagePath
  }

  // Liste des photos d'un produit
  getProductPhotos(productId) {
    const productDir = path.join(this.cataloguePath, productId)

    if (!fs.existsSync(productDir)) {
      return []
    }

    const files = fs.readdirSync(productDir)
    return files.filter((file) => {
      const ext = path.extname(file).toLowerCase()
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
    })
  }

  // Getter pour le middleware upload
  getUploadMiddleware() {
    return upload
  }
  // Méthodes utilitaires pour la gestion des fichiers
  ensureProductDirectory(productId) {
    const productDir = path.join(this.cataloguePath, productId)
    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir, { recursive: true })
    }
    return productDir
  }
}

// Export d'une instance unique
module.exports = new FileService(config.server.paths.catalogue)
