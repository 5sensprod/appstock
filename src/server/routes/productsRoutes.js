const express = require('express')
const router = express.Router()

module.exports = (db, sendSseEvent) => {
  const { products, categories } = db

  router.get('/', (req, res) => {
    products.find({}, (err, docs) => {
      if (err) res.status(500).send(err)
      else res.status(200).json(docs)
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

      // Créer une Map pour les relations catégorie-parent
      const categoryMap = new Map()
      allCategories.forEach((cat) => {
        categoryMap.set(cat._id, { ...cat, count: 0, productIds: [] })
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
      })

      // Convertir la Map en un objet pour la réponse
      const countByCategory = {}
      categoryMap.forEach((value, key) => {
        countByCategory[key] = {
          count: value.count,
          productIds: value.productIds,
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
    const newProduct = req.body
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
        })
        res
          .status(200)
          .json({ message: 'Produits mis à jour', count: results.length })
      })
      .catch((err) => res.status(500).send(err))
  })
  router.put('/:id', (req, res) => {
    const id = req.params.id
    const updatedProduct = { $set: req.body }

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

    products.remove({ _id: id }, {}, (err, numRemoved) => {
      if (err) {
        console.error('Erreur lors de la suppression du produit:', err)
        return res.status(500).send(err)
      }
      sendSseEvent({ type: 'product-deleted', id: id })
      res.status(200).json({ message: 'Produit supprimé' })
    })
  })

  return router
}
