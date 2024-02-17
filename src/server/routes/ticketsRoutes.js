const express = require('express')
const router = express.Router()

module.exports = (db) => {
  // Assurez-vous d'avoir une collection `tickets` dans votre objet `db`

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
      .sort({ ticketNumber: -1 })
      .limit(1)
      .exec((err, lastTicket) => {
        if (err) {
          return res
            .status(500)
            .send('Erreur lors de la récupération du dernier numéro de ticket.')
        }

        let lastNumber = 0
        if (lastTicket && lastTicket.length > 0) {
          const lastTicketNumber = lastTicket[0].ticketNumber.split('-')[2] // Correction ici pour extraire correctement le numéro séquentiel
          lastNumber = parseInt(lastTicketNumber, 10)
        }

        const newTicketNumber = `TKT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(lastNumber + 1).padStart(6, '0')}`

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
          ticketNumber: newTicketNumber,
          date: new Date().toISOString(),
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
