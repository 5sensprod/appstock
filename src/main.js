// src/main.js
const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const { setupIpcHandlers } = require('./main/ipcHandlers')
const { initializeApp } = require('./main/appInitialization')
const { SerialPort } = require('serialport')
const {
  initializeSerialPort,
  sendToLcd,
} = require('./main/serialCommunication')
const { autoUpdater } = require('electron')

const path = require('path')
let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 980,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  })

  console.log('Creating main window...')
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
}

function setupAutoUpdater() {
  if (require('electron-squirrel-startup')) return
  if (process.platform !== 'win32') return

  const server = 'https://update.electronjs.org'
  const url = `${server}/5sensprod/appstock/${process.platform}-${process.arch}/${app.getVersion()}`

  autoUpdater.setFeedURL({ url })

  autoUpdater.on('checking-for-update', () => {
    console.log('Vérification des mises à jour...')
  })

  autoUpdater.on('update-available', () => {
    console.log('Mise à jour disponible.')
    dialog.showMessageBox({
      type: 'info',
      title: 'Mise à jour',
      message: 'Une mise à jour est disponible. Téléchargement en cours...',
    })
  })

  autoUpdater.on('update-downloaded', () => {
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Installation',
        message: 'La mise à jour va être installée.',
      })
      .then(() => autoUpdater.quitAndInstall())
  })

  autoUpdater.on('error', (err) => {
    console.error('Erreur AutoUpdater:', err)
  })

  // Vérification immédiate + toutes les 5 minutes
  autoUpdater.checkForUpdates()
  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 300000)
}

app.on('ready', () => {
  console.log('Electron app is ready. Initializing...')
  const gotTheLock = app.requestSingleInstanceLock()

  if (!gotTheLock) {
    dialog.showErrorBox(
      "Instance déjà en cours d'exécution",
      "Une autre instance de cette application est déjà en cours d'exécution. Veuillez la fermer avant d'en ouvrir une nouvelle.",
    )
    app.quit()
  } else {
    app.on('second-instance', () => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
      }
    })

    // Démarrage du serveur avant de créer la fenêtre Electron
    console.log('Starting the server...')
    require('../src/server/server.js') // Démarrer le serveur WebSocket

    console.log('Server started successfully. Creating Electron window...')
    createWindow()

    initializeApp(mainWindow).catch((error) => {
      console.error("Erreur lors de l'initialisation de l'application:", error)
    })

    setupIpcHandlers(mainWindow) // Configurer les handlers IPC
  }
  setupAutoUpdater()
})

// Ajouter le gestionnaire d'événement pour afficher le message "Déconnexion"
app.on('before-quit', () => {
  console.log(
    'Application is closing, displaying disconnection message on LCD...',
  )
  sendToLcd({ line1: 'Déconnexion', line2: 'À bientôt !' })

  // Effacer l'écran après 3 secondes
  setTimeout(() => {
    sendToLcd({ line1: '', line2: '' }) // Efface l'écran LCD
    console.log('LCD screen cleared.')
  }, 3000)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Handler IPC pour obtenir les ports série disponibles
ipcMain.handle('get-serial-ports', async () => {
  try {
    const ports = await SerialPort.list()
    return ports.map((port) => port.path)
  } catch (error) {
    console.error('Erreur lors de la récupération des ports série :', error)
    return []
  }
})

// Handler IPC pour définir le port série sélectionné
ipcMain.on('set-serial-port', (event, selectedPort) => {
  console.log(`Port série sélectionné : ${selectedPort}`)
  initializeSerialPort(selectedPort) // Réinitialiser le port série avec le port sélectionné
})
