const express = require('express')
const router = express.Router()

module.exports = (db, sendSseEvent) => {
  const { products } = db

  router.get('/', (req, res) => {
    products.find({}, (err, docs) => {
      if (err) res.status(500).send(err)
      else res.status(200).json(docs)
    })
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
