const express = require('express')
const router = express.Router()

module.exports = (db) => {
  // Obtenir tous les tickets
  router.get('/', (req, res) => {
    db.tickets.find({}, (err, tickets) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des tickets.')
      } else {
        res.status(200).json(tickets)
      }
    })
  })

  // Ajouter un nouveau ticket
  router.post('/', (req, res) => {
    db.tickets
      .find({})
      .sort({ number: -1 })
      .limit(1)
      .exec((err, lastTicket) => {
        if (err) {
          return res
            .status(500)
            .send('Erreur lors de la récupération du dernier numéro de ticket.')
        }

        let lastNumber = 0
        let resetNumber = false

        // Vérifier si le dernier ticket a été émis aujourd'hui
        if (lastTicket && lastTicket.length > 0) {
          const lastDate = lastTicket[0].date.split('T')[0]
          const currentDate = new Date().toISOString().split('T')[0]

          // Comparer les dates
          if (lastDate === currentDate) {
            // Même jour, incrémenter le numéro
            const lastTicketNumber = lastTicket[0].number.split('-')[2] // Modifié pour utiliser la clé 'number'
            lastNumber = parseInt(lastTicketNumber, 10)
          } else {
            // Nouveau jour, réinitialiser le numéro
            resetNumber = true
          }
        } else {
          // Aucun ticket trouvé, considérer comme un nouveau jour
          resetNumber = true
        }

        // Générer le nouveau numéro de ticket, réinitialiser si nécessaire
        const newTicketNumber = `TKT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(resetNumber ? 1 : lastNumber + 1).padStart(6, '0')}`

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

        let newTicket = {
          ...req.body,
          items: itemsFormatted,
          totalHT: parseFloat(req.body.totalHT),
          totalTVA: parseFloat(req.body.totalTVA),
          totalTTC: parseFloat(req.body.totalTTC),
          number: newTicketNumber,
          date: new Date().toISOString(),
          pdfGenerationCount: 0,
        }

        db.tickets.insert(newTicket, (err, ticket) => {
          if (err) {
            return res.status(500).send("Erreur lors de l'ajout du ticket.")
          }
          return res.status(201).json(ticket)
        })
      })
  })

  return router
}
