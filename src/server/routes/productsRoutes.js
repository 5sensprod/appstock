const express = require('express')
const router = express.Router()

// Ici, db doit être passé en tant que paramètre ou importé si nécessaire
module.exports = (db) => {
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
      res.status(201).json(doc)
    })
  })

  // Ajoutez ici d'autres routes liées aux utilisateurs

  return router
}
