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
    console.log('Requête reçue sur /bulk-update avec les données :', req.body)
    const productsToUpdate = req.body // Un tableau d'objets produit
    const updatePromises = productsToUpdate.map((product) => {
      // Ajoutez le console.log ici
      console.log(
        `Mise à jour du produit ID ${product.id} avec`,
        product.changes,
      )

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
      .then((results) =>
        res
          .status(200)
          .json({ message: 'Produits mis à jour', count: results.length }),
      )
      .catch((err) => res.status(500).send(err))
  })
  router.put('/:id', (req, res) => {
    const id = req.params.id
    const updatedProduct = req.body

    products.update({ _id: id }, updatedProduct, {}, (err, numReplaced) => {
      if (err) {
        console.error('Erreur lors de la mise à jour du produit:', err)
        return res.status(500).send(err)
      }
      sendSseEvent({ type: 'product-updated', product: updatedProduct })
      res.status(200).json({ message: 'Produit mis à jour' })
    })
  })

  return router
}
