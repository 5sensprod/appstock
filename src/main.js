const { app, BrowserWindow, ipcMain, session } = require('electron')
const path = require('path')
require('../src/server/server.js')
const { getLocalIPv4Address } = require('./server/networkUtils')
const Store = require('electron-store')
const store = new Store()
let mainWindow

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
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  mainWindow.webContents.openDevTools()
}
app.on('ready', () => {
  createWindow()
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          `default-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://${localIp}:5000;`,
        ],
      },
    })
  })

  const localIp = getLocalIPv4Address()
  console.log(`Adresse IP locale: ${localIp}`)

  // Stocker l'adresse IP locale dans electron-store
  store.set('localIp', localIp)
  console.log(`Adresse IP stockée dans electron-store: ${store.get('localIp')}`)

  mainWindow.webContents.once('dom-ready', () => {
    const localIp = getLocalIPv4Address() // Assurez-vous que cette fonction renvoie l'adresse IP locale
    mainWindow.webContents.send('localIp', localIp)
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
