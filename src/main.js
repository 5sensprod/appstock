const { app, BrowserWindow, ipcMain, session } = require('electron')
const path = require('path')
require('../src/server/server.js')
const { getLocalIPv4Address } = require('./server/networkUtils')
const Store = require('electron-store')
const store = new Store()
let mainWindow
const logToFile = require('./logger')
const config = require('../config.json')
const schedule = require('node-schedule')

const SftpClient = require('electron-ssh2-sftp-client')

async function exportBackupToSftp(backupPath, dbName) {
  const sftp = new SftpClient()
  const remoteFilePath = `/axe_backup/${path.basename(backupPath)}`

  try {
    await sftp.connect({
      host: config.SFTP_HOST,
      port: config.SFTP_PORT,
      username: config.SFTP_USERNAME,
      password: config.SFTP_PASSWORD,
    })

    await sftp.put(backupPath, remoteFilePath)
    logToFile(`Backup exporté avec succès pour ${dbName}`)
  } catch (error) {
    logToFile(`Erreur lors de l'exportation du backup pour ${dbName}: ${error}`)
    throw error
  } finally {
    sftp.end()
  }
}

ipcMain.handle('export-directly', async (event, dbPath, dbName) => {
  try {
    console.log(`Début de l'exportation directe pour ${dbName}`)
    await exportBackupToSftp(dbPath, dbName) // Utilise la même fonction d'exportation SFTP
    console.log(`Exportation directe réussie pour ${dbName}`)
  } catch (error) {
    console.error(`Erreur lors de l'exportation directe pour ${dbName}:`, error)
    throw new Error(
      `Échec de l'exportation directe pour ${dbName}: ${error.message}`,
    )
  }
})

ipcMain.on('print', (event, content) => {
  let win = new BrowserWindow({ show: false })
  win.loadURL('data:text/html;charset=utf-8,' + encodeURI(content))
  win.webContents.on('did-finish-load', () => {
    win.webContents.print({}, (success, errorType) => {
      if (!success) console.log(errorType)
    })
  })
})

ipcMain.handle('get-paths', async () => {
  const userDataPath = app.getPath('userData')
  return {
    dbPaths: {
      categories: path.join(userDataPath, 'categories.db'),
      users: path.join(userDataPath, 'users.db'),
      products: path.join(userDataPath, 'products.db'),
      invoices: path.join(userDataPath, 'invoices.db'),
    },
    backupDir: app.getPath('desktop'),
  }
})

ipcMain.handle('export-to-sftp', async (event, backupPath, dbName) => {
  console.log(`Début de l'exportation SFTP pour ${dbName}`)
  try {
    // Utilisez la fonction existante pour l'exportation SFTP
    await exportBackupToSftp(backupPath, dbName)
    console.log(`Exportation SFTP réussie pour ${dbName}`)
    return `Exportation SFTP réussie pour ${dbName}`
  } catch (error) {
    console.error(`Erreur lors de l'exportation SFTP pour ${dbName}:`, error)
    throw new Error(
      `Échec de l'exportation SFTP pour ${dbName}: ${error.message}`,
    )
  }
})

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  })

  ipcMain.handle('get-local-ip', async () => {
    return getLocalIPv4Address()
  })

  ipcMain.handle('get-stored-ip', (event) => {
    return store.get('localIp') // Récupérer l'adresse IP depuis electron-store
  })

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  // mainWindow.webContents.openDevTools()
}

const getDatabasePaths = () => {
  const userDataPath = app.getPath('userData')
  return {
    categories: path.join(userDataPath, 'categories.db'),
    users: path.join(userDataPath, 'users.db'),
    products: path.join(userDataPath, 'products.db'),
    invoices: path.join(userDataPath, 'invoices.db'),
  }
}

const scheduleExport = () => {
  schedule.scheduleJob('23 4 * * 1-6', async () => {
    try {
      const dbPaths = getDatabasePaths()
      for (const [dbName, dbPath] of Object.entries(dbPaths)) {
        await exportBackupToSftp(dbPath, dbName)
      }
      console.log('Exportation automatique réussie')
    } catch (error) {
      console.error("Erreur lors de l'exportation automatique:", error)
    }
  })
}

app.on('ready', async () => {
  createWindow()

  // Récupération de l'adresse IP actuelle
  const currentIp = await getLocalIPv4Address()
  // Récupération de l'adresse IP stockée dans electron-store
  const storedIp = store.get('localIp')

  // Vérification si l'adresse IP actuelle est différente de celle stockée
  if (currentIp !== storedIp) {
    store.set('localIp', currentIp)
    console.log(`Adresse IP mise à jour dans electron-store: ${currentIp}`)
  } else {
    console.log(`Adresse IP deja stockee dans electron-store: ${storedIp}`)
  }

  // Mise à jour de la politique de sécurité du contenu avec l'adresse IP actuelle
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const policy = `img-src 'self' http://localhost:5000 http://${currentIp}:5000; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval'; connect-src 'self' http://${currentIp}:5000 ws://${currentIp}:5000 http://localhost:5000; font-src 'self' data: 'unsafe-inline';`
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [policy],
      },
    })
  })

  // Envoi de l'adresse IP au processus de rendu
  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.webContents.send('localIp', currentIp)
  })

  scheduleExport()
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
