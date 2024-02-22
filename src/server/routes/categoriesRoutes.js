const express = require('express')
const router = express.Router()

module.exports = (db, sendSseEvent) => {
  const { products, categories } = db

  router.get('/', (req, res) => {
    categories.find({}, (err, docs) => {
      if (err) res.status(500).send(err)
      else res.status(200).json(docs)
    })
  })

  router.get('/productCountByCategory', async (req, res) => {
    try {
      // Obtenir toutes les catégories
      const allCategories = await new Promise((resolve, reject) => {
        categories.find({}, (err, docs) => {
          if (err) reject(err)
          else resolve(docs)
        })
      })

      // Obtenir tous les produits
      const allProducts = await new Promise((resolve, reject) => {
        products.find({}, (err, docs) => {
          if (err) reject(err)
          else resolve(docs)
        })
      })

      // Fonction pour compter les produits dans une catégorie et ses sous-catégories
      const countProductsInCategory = (categoryId) => {
        // Compter les produits directement dans la catégorie
        const directCount = allProducts.filter(
          (product) => product.categorie === categoryId,
        ).length

        // Compter les produits dans les sous-catégories
        const subCategories = allCategories.filter(
          (cat) => cat.parentId === categoryId,
        )
        const subCategoryCount = subCategories.reduce(
          (acc, subCat) => acc + countProductsInCategory(subCat._id),
          0,
        )

        return directCount + subCategoryCount
      }

      // Compter les produits par catégorie
      const productCountByCategory = allCategories.reduce((acc, category) => {
        acc[category._id] = countProductsInCategory(category._id)
        return acc
      }, {})

      res.json(productCountByCategory)
    } catch (error) {
      console.error(
        'Erreur lors de la récupération du nombre de produits par catégorie:',
        error,
      )
      res.status(500).send(error)
    }
  })

  router.get('/subCategoryCount', async (req, res) => {
    try {
      const allCategories = await new Promise((resolve, reject) => {
        categories.find({}, (err, docs) => {
          if (err) reject(err)
          else resolve(docs)
        })
      })

      const subCategoryCounts = allCategories.map((cat) => ({
        _id: cat._id,
        name: cat.name,
        childCount: allCategories.filter((c) => c.parentId === cat._id).length,
      }))

      res.status(200).json(subCategoryCounts)

      // Envoyer un événement SSE pour indiquer la mise à jour des comptes de sous-catégories
      sendSseEvent({
        type: 'subCategoryCounts-updated',
        subCategoryCounts: subCategoryCounts,
      })
    } catch (error) {
      res.status(500).send(error)
    }
  })

  router.post('/', (req, res) => {
    const newCategory = req.body

    categories.insert(newCategory, (err, doc) => {
      if (err) {
        console.error("Erreur lors de l'insertion de la catégorie:", err)
        return res.status(500).send(err)
      }
      sendSseEvent({ type: 'category-added', category: doc })
      res.status(201).json(doc)
    })
  })

  router.put('/:id', (req, res) => {
    const id = req.params.id
    const updatedCategory = { $set: req.body }

    categories.update({ _id: id }, updatedCategory, {}, (err, numReplaced) => {
      if (err) {
        console.error('Erreur lors de la mise à jour de la catégorie:', err)
        return res.status(500).send(err)
      }
      sendSseEvent({ type: 'category-updated', category: req.body })
      res.status(200).json({ message: 'Catégorie mise à jour', id: id })
    })
  })

  const deleteCategoryAndChildren = async (categoryId) => {
    const childCategories = await new Promise((resolve, reject) => {
      categories.find({ parentId: categoryId }, (err, docs) => {
        if (err) reject(err)
        else resolve(docs)
      })
    })

    for (const childCategory of childCategories) {
      await deleteCategoryAndChildren(childCategory._id)
      sendSseEvent({ type: 'category-deleted', id: childCategory._id })
    }

    await new Promise((resolve, reject) => {
      categories.remove({ _id: categoryId }, {}, (err, numRemoved) => {
        if (err) reject(err)
        else {
          sendSseEvent({ type: 'category-deleted', id: categoryId })
          resolve(numRemoved)
        }
      })
    })
  }

  router.delete('/:id', async (req, res) => {
    const id = req.params.id

    try {
      await deleteCategoryAndChildren(id)
      res
        .status(200)
        .json({ message: 'Catégorie et sous-catégories supprimées', id: id })
    } catch (err) {
      console.error('Erreur lors de la suppression de la catégorie:', err)
      res.status(500).send(err)
    }
  })

  return router
}
