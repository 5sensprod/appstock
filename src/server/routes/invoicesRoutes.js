const express = require('express')
const router = express.Router()

module.exports = (db) => {
  router.get('/', (req, res) => {
    db.invoices.find({}, (err, invoices) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des factures.')
      } else {
        res.status(200).json(invoices)
      }
    })
  })

  router.post('/', async (req, res) => {
    db.invoices
      .find({})
      .sort({ number: -1 }) // Modifié pour trier par 'number'
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

        if (lastInvoice && lastInvoice.length > 0) {
          const lastDate = lastInvoice[0].date.split('T')[0]
          const currentDate = new Date().toISOString().split('T')[0]

          if (lastDate === currentDate) {
            // Utilisez la nouvelle clé 'number' pour extraire le dernier numéro
            const lastInvoiceNumber = lastInvoice[0].number.split('-')[2]
            lastNumber = parseInt(lastInvoiceNumber, 10)
          } else {
            resetNumber = true
          }
        } else {
          resetNumber = true
        }

        const newInvoiceNumber = `FACT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(resetNumber ? 1 : lastNumber + 1).padStart(6, '0')}`

        let itemsFormatted = req.body.items.map((item) => ({
          ...item,
          quantite: parseInt(item.quantite, 10),
          puHT: parseFloat(item.puHT),
          puTTC: parseFloat(item.puTTC),
          tauxTVA: parseFloat(item.tauxTVA),
          totalItem: parseFloat(item.totalItem),
          montantTVA: parseFloat(item.montantTVA),
          remiseMajorationValue: item.remiseMajorationValue
            ? parseFloat(item.remiseMajorationValue)
            : 0,
        }))

        let newInvoice = {
          ...req.body,
          items: itemsFormatted,
          totalHT: parseFloat(req.body.totalHT),
          totalTVA: parseFloat(req.body.totalTVA),
          totalTTC: parseFloat(req.body.totalTTC),
          number: newInvoiceNumber, // Utilisez 'number' au lieu de 'invoiceNumber'
          date: new Date().toISOString(),
        }

        db.invoices.insert(newInvoice, (err, invoice) => {
          if (err) {
            return res.status(500).send("Erreur lors de l'ajout de la facture.")
          }
          res.status(201).json(invoice)
        })
      })
  })

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
