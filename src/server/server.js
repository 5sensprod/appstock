const express = require('express')
const electron = require('electron')
const app = express()
const port = 5000
const path = require('path')
const initializeDatabases = require('../database/database')
const http = require('http')
const cors = require('cors')
const { getLocalIPv4Address } = require('./networkUtils')
const staticFilesPath = path.join(__dirname, '..', 'renderer', 'main_window')
const fs = require('fs')
const { dialog } = electron

const userDataPath = (electron.app || electron.remote.app).getPath('userData')
const cataloguePath = path.join(userDataPath, 'catalogue')
module.exports.cataloguePath = cataloguePath

app.use('/catalogue', express.static(cataloguePath))
app.use(express.json())
app.use(express.static(staticFilesPath))
app.use(
  cors({
    origin: '*',
  }),
)

const multer = require('multer')

// Configuration de multer pour stocker les fichiers dans des dossiers spécifiques à chaque produit
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const productId = req.params.productId
    const productFolderPath = path.join(cataloguePath, productId)
    if (!fs.existsSync(productFolderPath)) {
      fs.mkdirSync(productFolderPath, { recursive: true })
    }
    cb(null, productFolderPath)
  },
  filename: function (req, file, cb) {
    // Vérifiez l'extension ici
    const extension = path.extname(file.originalname).toLowerCase()
    if (
      extension === '.png' ||
      extension === '.jpg' ||
      extension === '.jpeg' ||
      extension === '.webp'
    ) {
      // Définissez uniqueSuffix ici, à l'intérieur de la fonction filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(null, file.fieldname + '-' + uniqueSuffix + extension)
    } else {
      cb(new Error('Type de fichier non autorisé'), null)
    }
  },
})

const upload = multer({ storage: storage })
module.exports.upload = upload

const sseClients = new Map()

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  // Générer un ID unique pour chaque client
  const clientId = Date.now()
  const newClient = {
    id: clientId,
    res,
  }
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
const quotesRoutes = require('./routes/quotesRoutes')
const ticketsRoutes = require('./routes/ticketsRoutes')
const printRoutes = require('./routes/printRoutes')
const suppliersRoutes = require('./routes/suppliersRoutes')

app.use('/api/print', printRoutes)

initializeDatabases().then((db) => {
  app.use('/api/users', usersRoutes(db))
  app.use('/api/products', productsRoutes(db, sendSseEvent))
  app.use('/api/categories', categoriesRoutes(db, sendSseEvent))
  app.use('/api/invoices', invoicesRoutes(db, sendSseEvent))
  app.use('/api/quotes', quotesRoutes(db, sendSseEvent))
  app.use('/api/tickets', ticketsRoutes(db, sendSseEvent))
  app.use('/api/suppliers', suppliersRoutes(db, sendSseEvent)) // Utilisation des routes des fournisseurs
})

app.use(errorHandler)

app.get('/main_window/index.js', (req, res) => {
  res.sendFile(path.join(staticFilesPath, 'index.js'))
})

// Simuler un état de "préparation" du serveur qui devient vrai après un certain délai
let serverReady = false
setTimeout(() => {
  serverReady = true
}, 1000) // Par exemple, après 10 secondes pour la simulation

app.get('/api/serverStatus', (req, res) => {
  if (serverReady) {
    res.json({ status: 'ready' })
  } else {
    res.status(503).json({ status: 'not ready' })
  }
})

server
  .listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://${getLocalIPv4Address()}:${port}`)
  })
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} est déjà utilisé.`)
      // Affiche une boîte de dialogue avec le message personnalisé avant de quitter
      dialog.showMessageBox("Instance déjà en cours d'exécution").then(() => {
        electron.app.quit()
      })
    }
  })
