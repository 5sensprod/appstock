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

    // Valider et traiter les données du nouveau produit ici
    // ...

    // Enregistrer le nouveau produit dans la base de données
    products.insert(newProduct, (err, doc) => {
      if (err) res.status(500).send(err)
      else res.status(201).json(doc)
    })
  })

  // Ajoutez ici d'autres routes liées aux utilisateurs

  return router
}
