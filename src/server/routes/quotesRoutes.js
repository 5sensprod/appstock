const express = require('express')
const router = express.Router()

module.exports = (db) => {
  function formatQuoteData(body) {
    const itemsFormatted = body.items.map((item) => ({
      ...item,
      quantity: parseInt(item.quantity, 10),
      prixHT: parseFloat(item.prixHT),
      prixTTC: parseFloat(item.prixTTC),
      tauxTVA: parseFloat(item.tauxTVA),
      prixOriginal: parseFloat(item.prixOriginal),
      totalTTCParProduit: parseFloat(item.totalTTCParProduit).toFixed(2),
    }))

    return {
      ...body,
      items: itemsFormatted,
      totalHT: parseFloat(body.totalHT).toFixed(2),
      totalTTC: parseFloat(body.totalTTC).toFixed(2),
      date: new Date().toISOString(), // Vous pouvez décider de mettre à jour la date ici ou la laisser telle quelle pour la mise à jour
    }
  }

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
    const quoteNumber = `Q-${getDateTimeString()}`
    const newQuote = formatQuoteData(req.body)
    newQuote.quoteNumber = quoteNumber // Ajouter le numéro de devis après formatage

    db.quotes.insert(newQuote, (err, quote) => {
      if (err) {
        res.status(500).send("Erreur lors de l'ajout du devis.")
      } else {
        res.status(201).json(quote)
      }
    })
  })

  // Mettre à jour un devis existant
  router.put('/:id', (req, res) => {
    const quoteId = req.params.id
    const updatedQuote = formatQuoteData(req.body) // Utiliser la même fonction pour formater les données

    db.quotes.update(
      { _id: quoteId },
      { $set: updatedQuote },
      {},
      (err, numReplaced) => {
        if (err) {
          res.status(500).send('Erreur lors de la mise à jour du devis.')
        } else if (numReplaced) {
          res.status(200).json({
            message: 'Devis mis à jour avec succès',
            _id: quoteId,
            updatedQuote,
          })
        } else {
          res.status(404).send('Devis non trouvé.')
        }
      },
    )
  })

  return router
}
