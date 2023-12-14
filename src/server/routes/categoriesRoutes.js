const express = require('express')
const router = express.Router()

module.exports = (db, sendSseEvent) => {
  const { categories } = db

  router.get('/', (req, res) => {
    categories.find({}, (err, docs) => {
      if (err) res.status(500).send(err)
      else res.status(200).json(docs)
    })
  })

  router.post('/', (req, res) => {
    const newCategory = req.body

    categories.insert(newCategory, (err, doc) => {
      if (err) {
        console.error("Erreur lors de l'insertion de la catégorie:", err)
        return res.status(500).send(err)
      }
      sendSseEvent({ type: 'category-added', category: doc }) // Envoyer un événement SSE
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

  router.delete('/:id', (req, res) => {
    const id = req.params.id

    categories.remove({ _id: id }, {}, (err, numRemoved) => {
      if (err) {
        console.error('Erreur lors de la suppression de la catégorie:', err)
        return res.status(500).send(err)
      }
      sendSseEvent({ type: 'category-deleted', id: id })
      res.status(200).json({ message: 'Catégorie supprimée', id: id })
    })
  })

  return router
}
