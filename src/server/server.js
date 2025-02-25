const express = require('express')
const electron = require('electron')
const app = express()
const config = require('./config/server.config')
const path = require('path')
const staticFilesPath = config.paths.static
const cataloguePath = config.paths.catalogue
const upload = require('./config/multer.config')
const http = require('http')
const fs = require('fs')
const { getLocalIPv4Address } = require('./utils/networkUtils')
const { dialog } = electron

// Exports nécessaires
module.exports = { cataloguePath, upload }

const initializeMiddleware = require('./middleware')
initializeMiddleware(app)

// SSE
const sseClients = new Map()
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  const clientId = Date.now()
  const newClient = { id: clientId, res }
  sseClients.set(clientId, newClient)
  req.on('close', () => {
    console.log(`Client ${clientId} déconnecté`)
    sseClients.delete(clientId)
  })
})

const sendSseEvent = (data) => {
  sseClients.forEach((client) => {
    client.res.write(`data: ${JSON.stringify(data)}\n\n`)
  })
}

// Serveur et WebSocket
const server = http.createServer(app)
const initializeWebSocket = require('./websocket')
initializeWebSocket(server)

// Routes statiques
app.get('/main_window/index.js', (req, res) => {
  res.sendFile(path.join(staticFilesPath, 'index.js'))
})

// Routes API
const initializeRoutes = require('./routes')
const initializeDatabases = require('./database/database')
const { errorHandler } = require('./middleware/errorHandler')

initializeDatabases().then((db) => {
  // Correction marge
  app.post('/api/products/correct-margins', async (req, res) => {
    try {
      const products = await new Promise((resolve, reject) => {
        db.products.find({}, (err, docs) => (err ? reject(err) : resolve(docs)))
      })

      const updates = products
        .map((product) => {
          if (!product.prixAchat || !product.prixVente) return null

          const tvaRate = product.tva ?? 0
          const isOccasion = product.categorie?.includes('occasion')

          // Prix de vente HT
          const prixVenteHT = isOccasion
            ? product.prixVente
            : product.prixVente / (1 + tvaRate / 100)

          // Calcul de la marge commerciale (et non du taux de marque)
          const newMarge =
            ((prixVenteHT - product.prixAchat) / product.prixAchat) * 100

          if (isNaN(newMarge)) return null

          return new Promise((resolve, reject) => {
            db.products.update(
              { _id: product._id },
              { $set: { marge: parseFloat(newMarge.toFixed(2)) } },
              {},
              (err) => (err ? reject(err) : resolve()),
            )
          })
        })
        .filter(Boolean)

      await Promise.all(updates)
      res.json({ success: true, updatedCount: updates.length })
    } catch (error) {
      console.error('Erreur correction marges:', error)
      res.status(500).json({ error: error.message })
    }
  })
  initializeRoutes(app, db, sendSseEvent)
  app.use(errorHandler)
})

server
  .listen(config.port, '0.0.0.0', () => {
    console.log(
      `Server running on http://${getLocalIPv4Address()}:${config.port}`,
    )
  })
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      dialog
        .showMessageBox("Instance déjà en cours d'exécution")
        .then(() => electron.app.quit())
    }
  })
