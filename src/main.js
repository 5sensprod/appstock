const { app, BrowserWindow, ipcMain, session } = require('electron')
const path = require('path')
require('../src/server/server.js')
const { getLocalIPv4Address } = require('./server/networkUtils')
const Store = require('electron-store')
const backupDatabase = require('./database/backup.js')
const store = new Store()
let mainWindow
const logToFile = require('./logger')
const config = require('../config.json')

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
  const desktopPath = app.getPath('desktop')
  return {
    dbPaths: {
      categories: path.join(userDataPath, 'categories.db'),
      users: path.join(userDataPath, 'users.db'),
      products: path.join(userDataPath, 'products.db'),
      invoices: path.join(userDataPath, 'invoices.db'),
    },
    backupDir: desktopPath,
  }
})
ipcMain.handle('trigger-backup', async (event, dbPath, backupDir, dbName) => {
  try {
    console.log(`Début de la sauvegarde pour ${dbName}`)

    // La fonction backupDatabase retourne le nom du fichier de sauvegarde
    const backupFileName = backupDatabase(dbPath, backupDir, dbName)
    const backupPath = path.join(backupDir, backupFileName)
    console.log(`Sauvegarde locale réussie pour ${dbName}: ${backupPath}`)

    // Retourne le chemin de la sauvegarde pour une utilisation ultérieure
    return backupPath
  } catch (error) {
    console.error(`Erreur dans la sauvegarde pour ${dbName}:`, error)
    throw new Error(`Échec de la sauvegarde pour ${dbName}: ${error.message}`)
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
