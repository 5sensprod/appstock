const express = require('express')
const app = express()
const port = 5000
const path = require('path')
const initializeDatabases = require('../database/database')
const http = require('http')
const cors = require('cors')
const { getLocalIPv4Address } = require('./networkUtils')
const staticFilesPath = path.join(__dirname, '..', 'renderer', 'main_window')

app.use(express.static(staticFilesPath))
app.use(cors())

// Route pour obtenir l'IP locale
app.get('/api/getLocalIp', (req, res) => {
  const localIp = getLocalIPv4Address()
  res.json({ ip: localIp })
})

const server = http.createServer(app)

// Importer la fonction d'initialisation WebSocket
const initializeWebSocket = require('./websocket')
initializeWebSocket(server)

// Middleware d'erreur
const errorHandler = require('./errorHandler')

// Routeurs
const usersRoutes = require('./routes/usersRoutes')
const productsRoutes = require('./routes/productsRoutes')
const categoriesRoutes = require('./routes/categoriesRoutes')
const invoicesRoutes = require('./routes/invoicesRoutes')

initializeDatabases().then((db) => {
  app.use('/api/users', usersRoutes(db))
  app.use('/api/products', productsRoutes(db))
  app.use('/api/categories', categoriesRoutes(db))
  app.use('/api/invoices', invoicesRoutes(db))
})

app.use(errorHandler)

app.get('/main_window/index.js', (req, res) => {
  res.sendFile(path.join(staticFilesPath, 'index.js'))
})

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
