const express = require('express')
const router = express.Router()

// Ici, db doit être passé en tant que paramètre ou importé si nécessaire
module.exports = (db, sendSseEvent) => {
  const { products } = db

  router.get('/', (req, res) => {
    products.find({}, (err, docs) => {
      if (err) res.status(500).send(err)
      else res.status(200).json(docs)
    })
  })

  router.post('/', (req, res) => {
    const newProduct = req.body

    products.insert(newProduct, (err, doc) => {
      if (err) {
        console.error("Erreur lors de l'insertion du produit:", err)
        return res.status(500).send(err)
      }
      sendSseEvent({ type: 'product-added', product: doc }) // Envoyer l'événement SSE
      res.status(201).json(doc)
    })
  })

  router.put('/:id', (req, res) => {
    const id = req.params.id
    const updatedProduct = req.body

    products.update({ _id: id }, updatedProduct, {}, (err, numReplaced) => {
      if (err) {
        console.error('Erreur lors de la mise à jour du produit:', err)
        return res.status(500).send(err)
      }
      sendSseEvent({ type: 'product-updated', product: updatedProduct }) // Envoyer l'événement SSE
      res.status(200).json({ message: 'Produit mis à jour' })
    })
  })

  // Ajoutez ici d'autres routes liées aux utilisateurs

  return router
}
