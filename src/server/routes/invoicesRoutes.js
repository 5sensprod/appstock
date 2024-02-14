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
  router.post('/', async (req, res) => {
    // Récupérer le dernier numéro de facture et incrémenter
    db.invoices
      .find({})
      .sort({ invoiceNumber: -1 })
      .limit(1)
      .exec((err, lastInvoice) => {
        if (err) {
          res
            .status(500)
            .send(
              'Erreur lors de la récupération du dernier numéro de facture.',
            )
          return
        }

        let lastNumber = 0
        if (lastInvoice.length > 0) {
          // Extrait le numéro après le tiret et le convertit en nombre
          const lastInvoiceNumber = lastInvoice[0].invoiceNumber.split('-')[1]
          lastNumber = parseInt(lastInvoiceNumber, 10)
        }

        // Générer le nouveau numéro de facture
        const newInvoiceNumber = `${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(lastNumber + 1).padStart(6, '0')}`

        // Création de la nouvelle facture avec le nouveau numéro
        let newInvoice = {
          ...req.body,
          invoiceNumber: newInvoiceNumber,
          date: new Date().toISOString(),
        }

        // Traitement des éléments (gardé tel quel de votre exemple)
        let itemsFormatted = req.body.items.map((item) => ({
          ...item,
          quantite: parseInt(item.quantite, 10),
          puHT: parseFloat(parseFloat(item.puHT).toFixed(2)),
          puTTC: parseFloat(parseFloat(item.puTTC).toFixed(2)),
          tauxTVA: parseFloat(item.tauxTVA),
          totalItem: parseFloat(parseFloat(item.totalItem).toFixed(2)),
          montantTVA: parseFloat(parseFloat(item.montantTVA).toFixed(2)),
          remiseMajorationValue: parseFloat(item.remiseMajorationValue),
        }))

        newInvoice.items = itemsFormatted
        newInvoice.totalHT = parseFloat(parseFloat(req.body.totalHT).toFixed(2))
        newInvoice.totalTVA = parseFloat(
          parseFloat(req.body.totalTVA).toFixed(2),
        )
        newInvoice.totalTTC = parseFloat(
          parseFloat(req.body.totalTTC).toFixed(2),
        )

        // Insérer la nouvelle facture dans la base de données
        db.invoices.insert(newInvoice, (err, invoice) => {
          if (err) {
            res.status(500).send("Erreur lors de l'ajout de la facture.")
          } else {
            res.status(201).json(invoice)
          }
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
