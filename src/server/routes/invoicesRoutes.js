const express = require('express')
const router = express.Router()

module.exports = (db) => {
  // Obtenir toutes les factures
  router.get('/', (req, res) => {
    db.invoices.find({}, (err, invoices) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des factures.')
      } else {
        res.status(200).json(invoices)
      }
    })
  })

  // Ajouter une nouvelle facture
  router.post('/', async (req, res) => {
    db.invoices
      .find({})
      .sort({ invoiceNumber: -1 })
      .limit(1)
      .exec((err, lastInvoice) => {
        if (err) {
          return res
            .status(500)
            .send(
              'Erreur lors de la récupération du dernier numéro de facture.',
            )
        }

        let lastNumber = 0
        let resetNumber = false

        // Vérifier si la dernière facture a été émise aujourd'hui
        if (lastInvoice && lastInvoice.length > 0) {
          const lastDate = lastInvoice[0].date.split('T')[0] // Extraire la date de la dernière facture
          const currentDate = new Date().toISOString().split('T')[0] // Date actuelle au format YYYY-MM-DD

          // Comparer les dates
          if (lastDate === currentDate) {
            // Même jour, incrémenter le numéro
            const lastInvoiceNumber = lastInvoice[0].invoiceNumber.split('-')[2]
            lastNumber = parseInt(lastInvoiceNumber, 10)
          } else {
            // Nouveau jour, réinitialiser le numéro
            resetNumber = true
          }
        } else {
          // Aucune facture trouvée, considérer comme un nouveau jour
          resetNumber = true
        }

        // Générer le nouveau numéro de facture, réinitialiser si nécessaire
        const newInvoiceNumber = `FACT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(resetNumber ? 1 : lastNumber + 1).padStart(6, '0')}`

        let newInvoice = {
          ...req.body,
          invoiceNumber: newInvoiceNumber,
          date: new Date().toISOString(),
          items: req.body.items.map((item) => ({
            ...item,
            quantite: parseInt(item.quantite, 10),
            puHT: parseFloat(item.puHT).toFixed(2),
            puTTC: parseFloat(item.puTTC).toFixed(2),
            tauxTVA: parseFloat(item.tauxTVA),
            totalItem: parseFloat(item.totalItem),
            montantTVA: parseFloat(item.montantTVA),
            remiseMajorationValue: item.remiseMajorationValue
              ? parseFloat(item.remiseMajorationValue)
              : 0,
          })),
          totalHT: parseFloat(req.body.totalHT),
          totalTVA: parseFloat(req.body.totalTVA),
          totalTTC: parseFloat(req.body.totalTTC),
        }

        db.invoices.insert(newInvoice, (err, invoice) => {
          if (err) {
            return res.status(500).send("Erreur lors de l'ajout de la facture.")
          }
          res.status(201).json(invoice)
        })
      })
  })

  // Mettre à jour une facture
  router.put('/:id', (req, res) => {
    const { id } = req.params
    db.invoices.update(
      { _id: id },
      { $set: req.body },
      {},
      (err, numAffected) => {
        if (err) {
          res.status(500).send('Erreur lors de la mise à jour de la facture.')
        } else {
          res.status(200).send({ numAffected })
        }
      },
    )
  })

  // Supprimer une facture
  router.delete('/:id', (req, res) => {
    const { id } = req.params
    db.invoices.remove({ _id: id }, {}, (err, numRemoved) => {
      if (err) {
        res.status(500).send('Erreur lors de la suppression de la facture.')
      } else {
        res.status(200).send({ numRemoved })
      }
    })
  })

  return router
}
