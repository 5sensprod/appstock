const express = require('express')
const app = express()
const port = 5000 // Vous pouvez choisir un autre port si nécessaire
const path = require('path')
const initializeDatabases = require('../database/database')
const { Server } = require('ws')
const http = require('http')
const cors = require('cors')
const { getLocalIPv4Address } = require('./networkUtils')

// Chemin du dossier contenant les fichiers statiques
const staticFilesPath = path.join(__dirname, '..', 'renderer', 'main_window')

// Définir le dossier pour les fichiers statiques
app.use(express.static(staticFilesPath))

app.use(cors())

app.get('/api/getLocalIp', (req, res) => {
  const localIp = getLocalIPv4Address()
  res.json({ ip: localIp })
})

// Créer un serveur HTTP à partir de l'instance Express
const server = http.createServer(app)

initializeDatabases().then((db) => {
  const { users, products, categories, invoices } = db

  // Route pour obtenir tous les utilisateurs
  app.get('/api/users', (req, res) => {
    users.find({}, (err, docs) => {
      if (err) res.status(500).send(err)
      else res.status(200).json(docs)
    })
  })

  app.get('/api/products', (req, res) => {
    products.find({}, (err, docs) => {
      if (err) res.status(500).send(err)
      else res.status(200).json(docs)
    })
  })

  app.get('/api/categories', (req, res) => {
    categories.find({}, (err, docs) => {
      if (err) res.status(500).send(err)
      else res.status(200).json(docs)
    })
  })

  app.get('/api/invoices', (req, res) => {
    invoices.find({}, (err, docs) => {
      if (err) res.status(500).send(err)
      else res.status(200).json(docs)
    })
  })

  // Autres routes...
})

// Route spécifique pour servir index.js
app.get('/main_window/index.js', (req, res) => {
  res.sendFile(path.join(staticFilesPath, 'index.js'))
})

// Démarrer le serveur WebSocket
const wss = new Server({ server })

wss.on('connection', (ws) => {
  console.log('Client WebSocket connecté')

  ws.on('message', (message) => {
    console.log('Message reçu: %s', message)
    // Traiter le message reçu
  })

  ws.on('close', () => {
    console.log('Client WebSocket déconnecté')
  })

  // Envoyer un message au client
  ws.send('Bienvenue sur le serveur WebSocket!')
})

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
