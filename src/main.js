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
const Store = require('electron-store')
const store = new Store()

const path = require('path')
let mainWindow
let updateCheckScheduled = false

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

function setupAutoUpdater() {
  if (require('electron-squirrel-startup')) return
  if (process.platform !== 'win32') return

  const server = 'https://update.electronjs.org'
  const url = `${server}/5sensprod/appstock/${process.platform}-${process.arch}/${app.getVersion()}`

  autoUpdater.setFeedURL({ url })

  // Vérifier si une mise à jour a été reportée
  const postponedUpdate = store.get('postponedUpdate')
  const lastUpdateCheck = store.get('lastUpdateCheck')
  const now = Date.now()

  autoUpdater.on('update-available', () => {
    // Si une mise à jour a été reportée et qu'on est dans une nouvelle session
    if (postponedUpdate && now - lastUpdateCheck > 86400000) {
      // 24h
      autoUpdater.downloadUpdate()
      return
    }

    dialog
      .showMessageBox(mainWindow, {
        type: 'info',
        title: 'Mise à jour disponible',
        message:
          "Une nouvelle version est disponible. Souhaitez-vous l'installer ?",
        buttons: [
          'Installer maintenant',
          'Me le rappeler au prochain démarrage',
        ],
        defaultId: 0,
        cancelId: 1,
      })
      .then(({ response }) => {
        if (response === 0) {
          autoUpdater.downloadUpdate()
        } else {
          // Sauvegarder l'information que l'utilisateur souhaite reporter la mise à jour
          store.set('postponedUpdate', true)
          store.set('lastUpdateCheck', now)
        }
      })
  })

  autoUpdater.on('update-downloaded', () => {
    dialog
      .showMessageBox(mainWindow, {
        type: 'info',
        title: 'Installation',
        message:
          "La mise à jour va être installée au redémarrage de l'application.",
        buttons: ['Redémarrer maintenant', 'Plus tard'],
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
}

app.on('ready', async () => {
  console.log('Electron app is ready. Initializing...')
  const gotTheLock = app.requestSingleInstanceLock()

  if (!gotTheLock) {
    console.log('Another instance is already running. Quitting...')
    app.quit()
    return
  }

  // Création de la fenêtre et initialisation
  createWindow()
  await initializeApp(mainWindow).catch((error) => {
    console.error("Erreur lors de l'initialisation de l'application:", error)
  })

  setupIpcHandlers(mainWindow)

  // Démarrage du serveur
  console.log('Starting the server...')
  require('../src/server/server.js')
  console.log('Server started successfully.')

  // Configuration de l'auto-updater après la création de la fenêtre
  if (!updateCheckScheduled) {
    updateCheckScheduled = true
    setTimeout(() => {
      setupAutoUpdater()
      autoUpdater.checkForUpdates()
    }, 5000) // Délai plus long pour éviter les conflits

    // Vérification périodique des mises à jour
    setInterval(() => {
      autoUpdater.checkForUpdates()
    }, 300000)
  }
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
