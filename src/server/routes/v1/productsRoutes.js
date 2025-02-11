const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const { upload } = require('../../server')
const { cataloguePath } = require('../../server')
const { getLocalIPv4Address } = require('../../utils/networkUtils')

module.exports = (db, sendSseEvent) => {
  const { products, categories } = db

  // Route pour récupérer les photos d'un produit
  router.get('/:productId/photos', (req, res) => {
    const productId = req.params.productId
    const productFolderPath = path.join(cataloguePath, productId)

    // Vérifier si le dossier du produit existe
    if (!fs.existsSync(productFolderPath)) {
      // Le dossier n'existe pas signifie aucun fichier photo pour ce produit
      // Renvoyer une réponse avec un tableau vide
      return res.status(200).json([])
    }

    try {
      const photos = fs.readdirSync(productFolderPath)
      // Filtre ou traitement supplémentaire si nécessaire
      res.json(photos)
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des photos pour le produit ${productId}:`,
        error,
      )
      res
        .status(500)
        .json({ message: 'Erreur lors de la récupération des photos.' })
    }
  })

  router.get('/:productId/featuredImage', (req, res) => {
    const { productId } = req.params

    db.products.findOne({ _id: productId }, (err, product) => {
      if (err) {
        console.error('Erreur lors de la récupération du produit', err)
        return res.status(500).json({
          message:
            "Erreur serveur lors de la récupération de l'image mise en avant",
        })
      }

      if (!product) {
        return res.status(404).json({
          message: 'Produit non trouvé',
        })
      }

      // Même si le produit n'a pas d'image mise en avant, cela n'est pas considéré comme une erreur
      const featuredImage = product.featuredImage || null // Ou une valeur par défaut
      res.status(200).json({ featuredImage })
    })
  })

  // Route pour téléverser une photo
  router.post('/:productId/upload', upload.array('photos'), (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Aucun fichier fourni.' })
    }

    const uploadedFilesInfo = req.files.map((file) => ({
      originalname: file.originalname,
      filename: file.filename,
      path: file.path,
    }))

    // Envoyer un événement SSE pour chaque fichier uploadé
    uploadedFilesInfo.forEach((fileInfo) => {
      sendSseEvent({
        type: 'photo-added',
        productId: req.params.productId,
        photo: fileInfo.filename,
      })
    })

    res.status(200).json({
      message: 'Fichiers uploadés avec succès',
      files: uploadedFilesInfo,
    })
  })

  router.post('/:productId/upload-url', async (req, res) => {
    const { imageUrl } = req.body
    const productId = req.params.productId

    if (!imageUrl) {
      return res.status(400).json({ message: "URL de l'image manquante." })
    }

    try {
      const productFolderPath = path.join(cataloguePath, productId)
      if (!fs.existsSync(productFolderPath)) {
        fs.mkdirSync(productFolderPath, { recursive: true })
      }

      const response = await axios.get(imageUrl, { responseType: 'stream' })
      const fileExtension = path.extname(new URL(imageUrl).pathname)
      const filename = `image-${Date.now()}${fileExtension}`
      const filePath = path.join(productFolderPath, filename)

      const writer = fs.createWriteStream(filePath)
      response.data.pipe(writer)

      writer.on('finish', () => {
        sendSseEvent({ type: 'photo-added', productId, photo: filename })
        res
          .status(200)
          .json({ message: 'Image téléchargée avec succès', filename })
      })
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image:", error)
      res
        .status(500)
        .json({ message: "Erreur lors du téléchargement de l'image." })
    }
  })

  router.post('/:productId/updateFeaturedImage', (req, res) => {
    const { productId } = req.params
    const { featuredImage } = req.body

    products.update(
      { _id: productId },
      { $set: { featuredImage } },
      {},
      (err, numReplaced) => {
        if (err) {
          console.error(
            "Erreur lors de la mise à jour de l'image mise en avant:",
            err,
          )
          res.status(500).json({
            message: "Erreur lors de la mise à jour de l'image mise en avant.",
          })
        } else {
          sendSseEvent({
            type: 'featured-image-updated',
            productId: productId,
            featuredImage: featuredImage,
          })
          res
            .status(200)
            .json({ message: 'Image mise en avant mise à jour avec succès' })
        }
      },
    )
  })

  router.post('/:productId/delete-photos', async (req, res) => {
    const productId = req.params.productId
    const { photosToDelete } = req.body // Un tableau de noms de fichiers

    try {
      photosToDelete.forEach((filename) => {
        const filePath = path.join(cataloguePath, productId, filename)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath) // Supprime le fichier

          // Envoyer un événement SSE pour chaque photo supprimée
          sendSseEvent({
            type: 'photo-deleted',
            productId: productId,
            photo: filename,
          })
        }
      })

      res.json({ message: 'Photos supprimées avec succès' })
    } catch (error) {
      console.error('Erreur lors de la suppression des photos:', error)
      res
        .status(500)
        .json({ message: 'Erreur lors de la suppression des photos' })
    }
  })

  router.get('/', (req, res) => {
    products.find({}, (err, docs) => {
      if (err) res.status(500).send(err)
      else {
        const localIp = getLocalIPv4Address()
        const productsWithFullUrls = docs.map((product) => ({
          ...product,
          photos: product.photos?.map(
            (photo) =>
              `http://${localIp}:5000/api/products/images/${product._id}/${path.basename(photo)}`,
          ),
        }))
        res.status(200).json(productsWithFullUrls)
      }
    })
  })

  router.get('/countByCategory', async (req, res) => {
    try {
      // Récupérer toutes les catégories
      const allCategories = await new Promise((resolve, reject) => {
        categories.find({}, (err, docs) => {
          if (err) reject(err)
          else resolve(docs)
        })
      })

      // Créer une Map pour les relations catégorie-parent et compter les sous-catégories
      const categoryMap = new Map()
      allCategories.forEach((cat) => {
        const childCount = allCategories.filter(
          (c) => c.parentId === cat._id,
        ).length
        categoryMap.set(cat._id, {
          ...cat,
          count: 0,
          productIds: [],
          childCount: childCount,
        })
      })

      // Récupérer tous les produits
      const allProducts = await new Promise((resolve, reject) => {
        products.find({}, (err, docs) => {
          if (err) reject(err)
          else resolve(docs)
        })
      })

      // Compter les produits et stocker leurs _id par catégorie
      allProducts.forEach((prod) => {
        // Comptage pour la catégorie principale
        if (categoryMap.has(prod.categorie)) {
          const category = categoryMap.get(prod.categorie)
          category.count++
          category.productIds.push(prod._id)

          // Mettre à jour les catégories parentes
          let parentId = category.parentId
          while (parentId) {
            const parentCategory = categoryMap.get(parentId)
            parentCategory.count++
            parentCategory.productIds.push(prod._id)
            parentId = parentCategory.parentId
          }
        }

        // Comptage pour la sous-catégorie
        if (prod.sousCategorie && categoryMap.has(prod.sousCategorie)) {
          const subCategory = categoryMap.get(prod.sousCategorie)
          subCategory.count++
          subCategory.productIds.push(prod._id)
        }
      })

      // Convertir la Map en un objet pour la réponse
      const countByCategory = {}
      categoryMap.forEach((value, key) => {
        countByCategory[key] = {
          count: value.count,
          productIds: value.productIds,
          childCount: value.childCount, // Inclure le nombre de sous-catégories
        }
      })

      // Envoyer un événement SSE avec les nouvelles données
      sendSseEvent({
        type: 'countByCategory-updated',
        countByCategory: countByCategory,
      })

      res.status(200).json(countByCategory)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  router.get('/:id', (req, res) => {
    const id = req.params.id

    products.findOne({ _id: id }, (err, doc) => {
      if (err) {
        res.status(500).send(err)
      } else {
        res.status(200).json(doc)
      }
    })
  })

  router.post('/', (req, res) => {
    // Ajout automatique de la date d'ajout (dateSoumission)
    const newProduct = {
      ...req.body,
      supplierId: req.body.supplierId || null,
      dateSoumission: new Date(), // Ajouter la date actuelle ici
    }

    products.insert(newProduct, (err, doc) => {
      if (err) {
        console.error("Erreur lors de l'insertion du produit:", err)
        return res.status(500).send(err)
      }
      sendSseEvent({ type: 'product-added', product: doc })
      res.status(201).json(doc)
    })
  })

  router.put('/bulk-update', (req, res) => {
    const productsToUpdate = req.body
    const updatePromises = productsToUpdate.map((product) => {
      return new Promise((resolve, reject) => {
        products.update(
          { _id: product.id },
          { $set: product.changes },
          {},
          (err, numReplaced) => {
            if (err) reject(err)
            else resolve(numReplaced)
          },
        )
      })
    })

    Promise.all(updatePromises)
      .then((results) => {
        sendSseEvent({
          type: 'products-bulk-updated',
          updatedCount: results.length,
          updatedProducts: productsToUpdate.map((p) => p.id),
        })
        res
          .status(200)
          .json({ message: 'Produits mis à jour', count: results.length })
      })
      .catch((err) => res.status(500).send(err))
  })
  router.put('/:id', (req, res) => {
    const id = req.params.id
    const updatedProduct = {
      $set: { ...req.body, supplierId: req.body.supplierId || null },
    }

    products.update({ _id: id }, updatedProduct, {}, (err, numReplaced) => {
      if (err) {
        console.error('Erreur lors de la mise à jour du produit:', err)
        return res.status(500).send(err)
      }
      sendSseEvent({ type: 'product-updated', product: req.body })
      res.status(200).json({ message: 'Produit mis à jour', id: id })
    })
  })

  router.delete('/:id', (req, res) => {
    const id = req.params.id
    const productFolderPath = path.join(cataloguePath, id) // Assurez-vous que cataloguePath est correctement défini

    products.remove({ _id: id }, {}, (err, numRemoved) => {
      if (err) {
        console.error('Erreur lors de la suppression du produit:', err)
        return res.status(500).send(err)
      }

      // Supprimer le dossier du produit et son contenu
      fs.rm(productFolderPath, { recursive: true, force: true }, (err) => {
        if (err) {
          console.error(
            'Erreur lors de la suppression du dossier du produit:',
            err,
          )
          // Vous pouvez choisir de ne pas bloquer la réponse en cas d'erreur de suppression du dossier
        }

        sendSseEvent({ type: 'product-deleted', id: id })
        res.status(200).json({ message: 'Produit supprimé' })
      })
    })
  })

  return router
}
