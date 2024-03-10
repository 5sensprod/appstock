const express = require('express')
const router = express.Router()

module.exports = (db) => {
  function formatQuoteData(body) {
    const itemsFormatted = body.items.map((item) => {
      // Calcul du montant de la TVA pour chaque article
      const tauxTVA = parseFloat(item.tauxTVA) / 100 // Convertir le taux de TVA en décimal
      const prixHT = parseFloat(item.prixHT)
      const montantTVA = prixHT * tauxTVA // Calculer le montant de la TVA

      const itemFormatted = {
        ...item,
        quantity: parseInt(item.quantity, 10),
        prixHT: parseFloat(prixHT.toFixed(2)),
        prixTTC: parseFloat(parseFloat(item.prixTTC).toFixed(2)),
        tauxTVA: parseFloat(item.tauxTVA), // Pas besoin de double conversion ici
        montantTVA: parseFloat(montantTVA.toFixed(2)), // Ajout du montant de la TVA calculé
        remiseMajorationValue: parseFloat(
          parseFloat(item.remiseMajorationValue).toFixed(2),
        ),
        totalTTCParProduit: parseFloat(
          parseFloat(item.totalTTCParProduit).toFixed(2),
        ),
      }

      // Inclure conditionnellement prixOriginal comme un nombre
      if (
        item.prixModifie &&
        parseFloat(item.prixModifie) !== parseFloat(item.prixVente)
      ) {
        itemFormatted.prixOriginal = parseFloat(
          parseFloat(item.prixOriginal).toFixed(2),
        )
      } else if (!item.prixModifie && item.remiseMajorationValue) {
        itemFormatted.prixOriginal = parseFloat(
          parseFloat(item.prixVente).toFixed(2),
        )
      }

      return itemFormatted
    })

    // Correction de l'erreur 'toFixed is not a function' pour totalHT et totalTTC
    const totalHT = body.items.reduce(
      (total, item) => total + parseFloat(item.prixHT) * item.quantity,
      0,
    )
    const totalTVA = body.items.reduce(
      (total, item) => total + parseFloat(item.montantTVA),
      0,
    )
    const totalTTC = totalHT + totalTVA

    return {
      ...body,
      items: itemsFormatted,
      totalHT: totalHT.toFixed(2),
      totalTTC: totalTTC.toFixed(2),
      date: new Date().toISOString(),
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

  router.get('/:id', (req, res) => {
    const quoteId = req.params.id

    db.quotes.findOne({ _id: quoteId }, (err, quote) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération du devis.')
      } else if (quote) {
        res.status(200).json(quote)
      } else {
        res.status(404).send('Devis non trouvé.')
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

  // Supprimer un devis existant
  router.delete('/:id', (req, res) => {
    const quoteId = req.params.id

    db.quotes.remove({ _id: quoteId }, {}, (err, numRemoved) => {
      if (err) {
        res.status(500).send('Erreur lors de la suppression du devis.')
      } else if (numRemoved) {
        res.status(200).json({ message: 'Devis supprimé avec succès.' })
      } else {
        res.status(404).send('Devis non trouvé.')
      }
    })
  })

  return router
}
