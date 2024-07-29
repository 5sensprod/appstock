const express = require('express')
const router = express.Router()

module.exports = (db, sendSseEvent) => {
  const { suppliers } = db

  // Route pour récupérer tous les fournisseurs
  router.get('/', (req, res) => {
    suppliers.find({}, (err, docs) => {
      if (err) res.status(500).send(err)
      else res.status(200).json(docs)
    })
  })

  // Route pour récupérer un fournisseur par ID
  router.get('/:id', (req, res) => {
    const id = req.params.id
    suppliers.findOne({ _id: id }, (err, doc) => {
      if (err) res.status(500).send(err)
      else res.status(200).json(doc)
    })
  })

  // Route pour ajouter un nouveau fournisseur
  router.post('/', (req, res) => {
    const newSupplier = req.body
    suppliers.insert(newSupplier, (err, doc) => {
      if (err) res.status(500).send(err)
      else {
        sendSseEvent({ type: 'supplier-added', supplier: doc })
        res.status(201).json(doc)
      }
    })
  })

  // Route pour mettre à jour un fournisseur
  router.put('/:id', (req, res) => {
    const id = req.params.id
    const updatedSupplier = { $set: req.body }

    suppliers.update({ _id: id }, updatedSupplier, {}, (err, numReplaced) => {
      if (err) res.status(500).send(err)
      else {
        sendSseEvent({ type: 'supplier-updated', supplier: req.body })
        res.status(200).json({ message: 'Fournisseur mis à jour', id: id })
      }
    })
  })

  // Route pour supprimer un fournisseur
  router.delete('/:id', (req, res) => {
    const id = req.params.id
    suppliers.remove({ _id: id }, {}, (err, numRemoved) => {
      if (err) res.status(500).send(err)
      else {
        sendSseEvent({ type: 'supplier-deleted', id: id })
        res.status(200).json({ message: 'Fournisseur supprimé' })
      }
    })
  })

  return router
}
