const express = require('express')
const electron = require('electron')
const app = express()
const config = require('./config/server.config')
const path = require('path')
const staticFilesPath = config.paths.static
const cataloguePath = config.paths.catalogue
const upload = require('./config/multer.config')
const http = require('http')
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
const initializeDatabases = require('./database')
const { errorHandler } = require('./middleware/errorHandler')

initializeDatabases().then((db) => {
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
