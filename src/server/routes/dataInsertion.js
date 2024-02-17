// src/server/routes/dataInsertion.js
const moment = require('moment')

const generateDocumentNumber = (db, prefix, callback) => {
  db.find({})
    .sort({ documentNumber: -1 })
    .limit(1)
    .exec((err, lastDocument) => {
      if (err) {
        callback(err, null)
        return
      }

      let lastNumber = 0
      if (lastDocument.length > 0) {
        const lastDocumentNumber = lastDocument[0].documentNumber.split('-')[1]
        lastNumber = parseInt(lastDocumentNumber, 10)
      }

      const newDocumentNumber = `${prefix}${moment().format('YYYYMMDD')}-${String(lastNumber + 1).padStart(6, '0')}`
      callback(null, newDocumentNumber)
    })
}

const insertData = (db, data, callback) => {
  generateDocumentNumber(db, data.prefix, (err, documentNumber) => {
    if (err) {
      callback(err, null)
      return
    }

    let newData = {
      ...data.body,
      documentNumber,
      date: moment().toISOString(),
    }

    // Adaptation pour les tickets ou factures, en fonction des champs requis
    if (data.type === 'invoice') {
      // Adaptation spécifique pour les factures
      newData = adaptInvoiceData(newData)
    } else if (data.type === 'ticket') {
      // Adaptation spécifique pour les tickets
      newData = adaptTicketData(newData)
    }

    db.insert(newData, (err, document) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, document)
      }
    })
  })
}

const adaptInvoiceData = (invoiceData) => {
  // Logique d'adaptation des données spécifiques aux factures
  return invoiceData
}

const adaptTicketData = (ticketData) => {
  // Logique d'adaptation des données spécifiques aux tickets
  // Par exemple, supprimer customerInfo si présent
  delete ticketData.customerInfo
  return ticketData
}

module.exports = {
  insertData,
}
