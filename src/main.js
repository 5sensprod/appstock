const {
  app,
  BrowserWindow,
  ipcMain,
  session,
  shell,
  dialog,
} = require('electron')
const path = require('path')
require('../src/server/server.js')
const { getLocalIPv4Address } = require('./server/networkUtils')
const Store = require('electron-store')
const store = new Store()
let mainWindow
const logToFile = require('./logger')
const config = require('../config.json')
const schedule = require('node-schedule')
const { SerialPort } = require('serialport')

const SftpClient = require('electron-ssh2-sftp-client')
const formatDate = () => {
  const date = new Date()
  return date.toISOString().split('T')[0].replace(/-/g, '')
}

async function exportBackupToSftp(dbPath, dbName) {
  const sftp = new SftpClient()
  const formattedDate = formatDate()
  const backupFileName = `${formattedDate}-${path.basename(dbPath)}`
  const remoteFilePath = `/axe_backup/${backupFileName}`

  try {
    await sftp.connect({
      host: config.SFTP_HOST,
      port: config.SFTP_PORT,
      username: config.SFTP_USERNAME,
      password: config.SFTP_PASSWORD,
    })

    await sftp.put(dbPath, remoteFilePath)
    logToFile(`Backup exporté avec succès pour ${dbName}`)
  } catch (error) {
    logToFile(`Erreur lors de l'exportation du backup pour ${dbName}: ${error}`)
    throw error
  } finally {
    sftp.end()
  }
}

ipcMain.on('print', async (event, content) => {
  let win = new BrowserWindow({ show: false })
  win.loadURL('data:text/html;charset=utf-8,' + encodeURI(content))

  win.webContents.on('did-finish-load', async () => {
    // Obtenir la liste des imprimantes disponibles de manière asynchrone
    const printers = await win.webContents.getPrintersAsync()

    // Trouver l'imprimante EPSON XP-212 213 Series parmi les imprimantes disponibles
    const posPrinter = printers.find((printer) =>
      printer.name.includes('POS-80'),
    )

    if (posPrinter) {
      // Options d'impression pour sélectionner spécifiquement l'imprimante POS-80
      // et d'autres paramètres recommandés pour l'impression thermique
      const printOptions = {
        deviceName: posPrinter.name,
        color: false,
        margins: {
          marginType: 'custom',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
        landscape: false,
        silent: false,
        pageSize: {
          width: 314961, // Largeur de 8cm en micropouces
          height: 600000, // Hauteur ajustée
        },
        scaleFactor: 233, // Ajuster selon besoin
      }

      // Lancer l'impression avec les options définies
      win.webContents.print(printOptions, (success, errorType) => {
        if (!success) console.log(`Erreur d'impression: ${errorType}`)
        else console.log('Impression réussie !')
        win.destroy()
      })
    } else {
      console.log(
        "Imprimante EPSON XP-212 213 Series non trouvée. Vérifiez que l'imprimante est correctement connectée et réessayez.",
      )
    }
  })
})

ipcMain.on('open-external-link', (event, url) => {
  shell.openExternal(url)
})

ipcMain.handle('export-to-sftp', async (event, backupPath, dbName) => {
  console.log(`Début de l'exportation SFTP pour ${dbName}`)
  try {
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
    width: 980,
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
    suppliers: path.join(userDataPath, 'suppliers.db'),
  }
}

const scheduleExport = () => {
  schedule.scheduleJob('30 18 * * 1-6', async () => {
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

ipcMain.on('update-lcd', (event, data) => {
  // Appeler la fonction pour envoyer les données à l'écran LCD
  sendToLcd(data)
})

let port // Assurez-vous que le port série est accessible globalement

function sendToLcd(data) {
  if (port && port.isOpen) {
    // Formater le message pour l'écran LCD
    const message = formatLcdMessage(data)
    console.log("Message formaté pour l'écran LCD:", message)
    // Envoyer la commande pour effacer l'écran
    const clearCommand = Buffer.from([0x0c]) // Commande pour effacer l'écran
    port.write(clearCommand, function (err) {
      if (err) {
        return console.log(
          "Erreur lors de l'envoi de la commande d'effacement : ",
          err.message,
        )
      }
      // Attendre un court instant avant d'envoyer le message
      setTimeout(() => {
        port.write(message, function (err) {
          if (err) {
            return console.log(
              "Erreur lors de l'écriture sur le port série : ",
              err.message,
            )
          }
          console.log("Message envoyé à l'écran LCD : ", message)
        })
      }, 100) // Délai de 100ms
    })
  } else {
    console.log("Le port série n'est pas ouvert.")
  }
}

function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function formatLcdMessage(data) {
  // Supprimer les accents des lignes
  const line1Clean = removeAccents(data.line1)
  const line2Clean = removeAccents(data.line2)
  // Limiter les lignes à 20 caractères
  const line1 = line1Clean.padEnd(20).substring(0, 20)
  const line2 = line2Clean.padEnd(20).substring(0, 20)
  return `${line1}${line2}`
}
async function initializeApp() {
  // Récupération de l'adresse IP actuelle
  const currentIp = await getLocalIPv4Address()

  // Récupération de l'adresse IP stockée dans electron-store
  const storedIp = store.get('localIp')

  // Vérification si l'adresse IP actuelle est différente de celle stockée
  if (currentIp !== storedIp) {
    store.set('localIp', currentIp)
    console.log(`Adresse IP mise à jour dans electron-store: ${currentIp}`)
  } else {
    console.log(`Adresse IP déjà stockée dans electron-store: ${storedIp}`)
  }

  // Mise à jour de la politique de sécurité du contenu avec l'adresse IP actuelle
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const policy = `
      default-src 'self';
      img-src 'self' blob: data: http://localhost:5000 http://${currentIp}:5000;
      style-src 'self' 'unsafe-inline';
      script-src 'self' 'unsafe-eval' blob: data:;
      worker-src 'self' blob: data:;
      connect-src 'self' http://${currentIp}:5000 ws://${currentIp}:5000 http://localhost:5000;
      font-src 'self' data: 'unsafe-inline';
    `

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

  // Ouvrir le port série COM10 et envoyer un message à l'écran LCD
  port = new SerialPort({
    path: 'COM10',
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    autoOpen: false, // Contrôle manuel de l'ouverture du port
  })

  // Gestion des erreurs du port série
  port.on('error', function (err) {
    console.log('Erreur du port série : ', err.message)
  })

  // Ouvrir le port série
  port.open(function (err) {
    if (err) {
      return console.log("Erreur lors de l'ouverture du port : ", err.message)
    }
    console.log('Port série ouvert sur COM10')

    // Envoi de la commande pour effacer l'écran
    const clearCommand = Buffer.from([0x0c]) // Commande pour effacer l'écran, ajustez en fonction de votre écran

    port.write(clearCommand, function (err) {
      if (err) {
        return console.log(
          "Erreur lors de l'envoi de la commande d'effacement : ",
          err.message,
        )
      }
      console.log("Commande d'effacement envoyée à l'écran LCD")

      // Attendre un court instant pour que l'écran ait le temps de se nettoyer
      setTimeout(() => {
        const message = 'AXE MUSIQUE \r\nBIENVENUE'
        port.write(message, function (err) {
          if (err) {
            return console.log(
              "Erreur lors de l'écriture sur le port série : ",
              err.message,
            )
          }
          console.log("Message envoyé à l'écran LCD : ", message)
        })
      }, 100) // Délai de 100ms
    })
  })

  scheduleExport()
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
      // Logique pour gérer une deuxième instance ici...
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
      }
    })

    createWindow()

    // Maintenant, vous pouvez démarrer votre serveur en toute sécurité, car cela ne se produira que si gotTheLock est true.
    require('../src/server/server.js') // Assurez-vous que le chemin est correct

    initializeApp().catch((error) => {
      console.error("Erreur lors de l'initialisation de l'application:", error)
    })
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
