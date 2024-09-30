const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const { setupIpcHandlers } = require('./main/ipcHandlers')
const { initializeApp } = require('./main/appInitialization')
const Store = require('electron-store')
const store = new Store()
let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 980,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  })

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
}

app.on('ready', () => {
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

    createWindow()

    require('../src/server/server.js') // Démarrer le serveur

    initializeApp(mainWindow).catch((error) => {
      console.error("Erreur lors de l'initialisation de l'application:", error)
    })

    setupIpcHandlers(mainWindow) // Configurer les handlers IPC
  }
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
