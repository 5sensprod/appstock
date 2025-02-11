const express = require('express')
const electron = require('electron')
const http = require('http')
const path = require('path')
const { dialog } = electron
const config = require('./config')
const { getLocalIPv4Address } = require('./utils/networkUtils')
const fileService = require('./services/FileService')
const sseService = require('./services/SSEService')
const webSocketService = require('./services/WebSocketService')

module.exports = {
  cataloguePath: fileService.cataloguePath,
  upload: config.upload,
}

const app = express()
const server = http.createServer(app)

const initializeMiddleware = require('./middleware')
initializeMiddleware(app)

app.get('/api/events', (req, res) => sseService.handleConnection(req, res))

webSocketService.initialize(server)

app.get('/main_window/index.js', (req, res) => {
  res.sendFile(path.join(config.server.paths.static, 'index.js'))
})

const initializeRoutes = require('./routes')
const initializeDatabases = require('./database')
const { errorHandler } = require('./middleware/errorHandler')

initializeDatabases().then((db) => {
  initializeRoutes(app, db, sseService.broadcast.bind(sseService))
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
        .showMessageBox("Instance déjà en cours d'exécution")
        .then(() => electron.app.quit())
    }
  })
