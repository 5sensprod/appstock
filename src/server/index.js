const express = require('express')
const electron = require('electron')
const http = require('http')
const path = require('path')
const { dialog } = electron

const config = require('./config')
const { getLocalIPv4Address } = require('./utils/networkUtils')
const { FileService, SSEService, WebSocketService } = require('./services')

const app = express()
const server = http.createServer(app)

const initializeMiddleware = require('./middleware')
initializeMiddleware(app)

app.get('/api/events', (req, res) => SSEService.handleConnection(req, res))

WebSocketService.initialize(server)

app.get('/main_window/index.js', (req, res) => {
  res.sendFile(path.join(config.server.paths.static, 'index.js'))
})

const initializeRoutes = require('./routes')
const initializeDatabases = require('./database')
const { errorHandler } = require('./middleware/errorHandler')

// Initialisation de la base de données et des routes
initializeDatabases().then((db) => {
  initializeRoutes(app, db, SSEService.broadcast.bind(SSEService))
  app.use(errorHandler)
})

server
  .listen(config.server.port, '0.0.0.0', () => {
    console.log(
      `Server running on http://${getLocalIPv4Address()}:${config.server.port}`,
    )
  })
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      dialog
        .showMessageBox({ message: "Instance déjà en cours d'exécution" })
        .then(() => electron.app.quit())
    }
  })

module.exports = {
  cataloguePath: FileService.cataloguePath,
  upload: config.upload,
}
