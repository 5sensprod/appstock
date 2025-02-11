const express = require('express')
const electron = require('electron')
const http = require('http')
const path = require('path')
const { dialog } = electron

const config = require('./config/server.config')
const { getLocalIPv4Address } = require('./utils/networkUtils')
const fileService = require('./services/FileService')
const sseService = require('./services/SSEService')
const webSocketService = require('./services/WebSocketService')

// Exports nécessaires
module.exports = {
  cataloguePath: fileService.cataloguePath,
  upload: fileService.getUploadMiddleware(),
}

// Initialisation de l'application
const app = express()
const server = http.createServer(app)

// Configuration des middlewares
const initializeMiddleware = require('./middleware')
initializeMiddleware(app)

// Configuration SSE
app.get('/api/events', (req, res) => sseService.handleConnection(req, res))

// Initialisation WebSocket
webSocketService.initialize(server)

// Routes statiques
app.get('/main_window/index.js', (req, res) => {
  res.sendFile(path.join(config.paths.static, 'index.js'))
})

// Initialisation des routes et de la base de données
const initializeRoutes = require('./routes')
const initializeDatabases = require('./database')
const { errorHandler } = require('./middleware/errorHandler')

initializeDatabases().then((db) => {
  initializeRoutes(app, db, sseService.broadcast.bind(sseService))
  app.use(errorHandler)
})

// Démarrage du serveur
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
