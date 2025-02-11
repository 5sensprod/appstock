// src/server/routes/v2/categories.js
const express = require('express')
const router = express.Router()

// Changement de la signature pour recevoir categoryService au lieu de db
function categoriesRoutes(categoryService, sendSseEvent) {
  // Liste des catégories
  router.get('/', async (req, res, next) => {
    try {
      const categories = await categoryService.categoryRepository.list()
      res.json(categories)
    } catch (error) {
      console.error('Error in GET /:', error)
      next(error)
    }
  })

  // Création d'une catégorie
  router.post('/', async (req, res, next) => {
    try {
      const category = await categoryService.create(req.body)
      if (req.query.sync === 'true') {
        await categoryService.pushToWooCommerce(category._id)
      }
      sendSseEvent({
        type: 'category_created',
        data: category,
      })
      res.status(201).json(category)
    } catch (error) {
      next(error)
    }
  })

  // Détails d'une catégorie
  router.get('/:id', async (req, res, next) => {
    try {
      const category = await categoryService.categoryRepository.findById(
        req.params.id,
      )
      if (!category) {
        return res.status(404).json({ message: 'Catégorie non trouvée' })
      }
      res.json(category)
    } catch (error) {
      next(error)
    }
  })

  // Mise à jour d'une catégorie
  router.put('/:id', async (req, res, next) => {
    try {
      const updatedCategory = await categoryService.categoryRepository.update(
        req.params.id,
        req.body,
      )
      if (!updatedCategory) {
        return res.status(404).json({ message: 'Catégorie non trouvée' })
      }
      if (req.query.sync === 'true') {
        await categoryService.pushToWooCommerce(req.params.id)
      }
      sendSseEvent({
        type: 'category_updated',
        data: updatedCategory,
      })
      res.json(updatedCategory)
    } catch (error) {
      next(error)
    }
  })

  // Suppression d'une catégorie
  router.delete('/:id', async (req, res, next) => {
    try {
      const result = await categoryService.categoryRepository.delete(
        req.params.id,
      )
      if (result === 0) {
        return res.status(404).json({ message: 'Catégorie non trouvée' })
      }
      sendSseEvent({
        type: 'category_deleted',
        data: { id: req.params.id },
      })
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  })

  // Synchronisation avec WooCommerce
  router.post('/sync', async (req, res, next) => {
    try {
      await categoryService.syncFromWooCommerce()
      sendSseEvent({
        type: 'categories_synced',
        data: { timestamp: new Date() },
      })
      res.json({ message: 'Synchronisation terminée' })
    } catch (error) {
      next(error)
    }
  })

  // Structure hiérarchique
  router.get('/hierarchy/tree', async (req, res, next) => {
    try {
      const hierarchy = await categoryService.getHierarchy()
      res.json(hierarchy)
    } catch (error) {
      next(error)
    }
  })

  return router
}

module.exports = categoriesRoutes
