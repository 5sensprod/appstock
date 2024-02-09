const express = require('express')
const router = express.Router()

module.exports = (db) => {
  // Obtenir tous les devis
  router.get('/', (req, res) => {
    db.quotes.find({}, (err, quotes) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des devis.')
      } else {
        res.status(200).json(quotes)
      }
    })
  })

  // Ajouter un nouveau devis
  router.post('/', (req, res) => {
    const quote = req.body
    db.quotes.insert(quote, (err, newQuote) => {
      if (err) {
        res.status(500).send("Erreur lors de l'ajout du devis.")
      } else {
        res.status(201).json(newQuote)
      }
    })
  })

  // Mettez ici d'autres méthodes pour gérer les devis (update, delete, etc.)

  return router
}
