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
const { initializeWooCommerce } = require('./main/wooManager')

const path = require('path')
let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 980,
    height: 600,
    title: `appstock v${app.getVersion()}`,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  })

  console.log('Creating main window...')
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  mainWindow.on('page-title-updated', (event) => {
    event.preventDefault()
  })
}

app.on('ready', () => {
  console.log('Electron app is ready. Initializing...')
  const gotTheLock = app.requestSingleInstanceLock()

  if (!gotTheLock) {
    app.quit()
    return
  }

  // Initialiser WooCommerce
  try {
    console.log('Initialisation de WooCommerce...')
    initializeWooCommerce()
    console.log('WooCommerce initialisé avec succès')
  } catch (error) {
    console.error('Erreur initialisation WooCommerce:', error)
  }

  // Démarrage du serveur
  console.log('Starting the server...')
  require('../src/server/server.js')
  console.log('Server started successfully.')

  // Création de la fenêtre et initialisation
  createWindow()
  initializeApp(mainWindow).catch((error) => {
    console.error("Erreur lors de l'initialisation de l'application:", error)
  })
  setupIpcHandlers(mainWindow)
  setupAutoUpdater()

  // Gestion de la seconde instance
  app.on('second-instance', () => {
    if (mainWindow) {
      dialog.showMessageBox({
        type: 'info',
        title: 'Application déjà ouverte',
        message: "Une instance est déjà en cours d'exécution.",
      })
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
})

function setupAutoUpdater() {
  if (require('electron-squirrel-startup')) return
  if (process.platform !== 'win32') return

  const server = 'https://update.electronjs.org'
  const url = `${server}/5sensprod/appstock/${process.platform}-${process.arch}/${app.getVersion()}`

  autoUpdater.setFeedURL({ url })

  let updateDownloaded = false

  autoUpdater.on('update-available', () => {
    if (!updateDownloaded) {
      dialog
        .showMessageBox({
          type: 'info',
          title: 'Mise à jour',
          message: 'Une mise à jour est disponible.',
          buttons: ['Installer maintenant', 'Plus tard'],
          defaultId: 0,
          cancelId: 1,
        })
        .then(({ response }) => {
          if (response === 0) {
            autoUpdater.downloadUpdate()
          }
        })
    }
  })

  autoUpdater.on('update-downloaded', () => {
    updateDownloaded = true
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Installation',
        message: 'Voulez-vous installer la mise à jour ?',
        buttons: ['Installer et redémarrer', 'Plus tard'],
        defaultId: 0,
        cancelId: 1,
      })
      .then(({ response }) => {
        if (response === 0) {
          autoUpdater.quitAndInstall()
        }
      })
  })

  autoUpdater.on('error', (err) => {
    console.error('Erreur AutoUpdater:', err)
  })

  setTimeout(() => {
    autoUpdater.checkForUpdates()
  }, 2000) // Délai pour éviter le conflit avec la vérification d'instance

  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 300000)
}

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
