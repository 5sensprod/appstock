const express = require('express')
const router = express.Router()

module.exports = (db) => {
  router.get('/', (req, res) => {
    db.quotes.find({}, (err, quotes) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des devis.')
      } else {
        res.status(200).json(quotes)
      }
    })
  })

  const getDateTimeString = () => {
    const now = new Date()
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
      2,
      '0',
    )}${String(now.getDate()).padStart(2, '0')}-${String(
      now.getHours(),
    ).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(
      now.getSeconds(),
    ).padStart(2, '0')}`
  }

  // Ajouter un nouveau devis
  router.post('/', (req, res) => {
    const dateTimeString = getDateTimeString()
    const quoteNumber = `Q-${dateTimeString}`

    let itemsFormatted = req.body.items.map((item) => ({
      ...item,
      quantity: parseInt(item.quantity, 10),
      prixHT: parseFloat(item.prixHT),
      prixTTC: parseFloat(item.prixTTC),
      tauxTVA: parseFloat(item.tauxTVA),
      totalTTCParProduit: parseFloat(
        parseFloat(item.totalTTCParProduit).toFixed(2),
      ),
    }))

    let newQuote = {
      ...req.body,
      items: itemsFormatted,
      totalHT: parseFloat(parseFloat(req.body.totalHT).toFixed(2)),
      totalTTC: parseFloat(parseFloat(req.body.totalTTC).toFixed(2)),
      quoteNumber,
      date: new Date().toISOString(),
    }

    db.quotes.insert(newQuote, (err, quote) => {
      if (err) {
        res.status(500).send("Erreur lors de l'ajout du devis.")
      } else {
        res.status(201).json(quote)
      }
    })
  })

  // Mettez ici d'autres méthodes pour gérer les devis (update, delete, etc.)

  return router
}
