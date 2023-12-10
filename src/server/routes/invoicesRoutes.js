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

  // Fonction pour obtenir la date et l'heure actuelle sous forme de chaîne
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

  // Ajouter une nouvelle facture
  router.post('/', (req, res) => {
    const dateTimeString = getDateTimeString()
    const invoiceNumber = `${dateTimeString}`
    let newInvoice = {
      ...req.body,
      invoiceNumber,
      date: new Date().toISOString(),
    }

    db.invoices.insert(newInvoice, (err, invoice) => {
      if (err) {
        res.status(500).send("Erreur lors de l'ajout de la facture.")
      } else {
        res.status(201).send(invoice)
      }
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
