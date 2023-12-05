const express = require('express')
const router = express.Router()

// Ici, db doit être passé en tant que paramètre ou importé si nécessaire
module.exports = (db) => {
  const { invoices } = db

  router.get('/', (req, res) => {
    invoices.find({}, (err, docs) => {
      if (err) res.status(500).send(err)
      else res.status(200).json(docs)
    })
  })

  // Ajoutez ici d'autres routes liées aux utilisateurs

  return router
}
