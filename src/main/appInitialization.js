const { app, session, dialog } = require('electron')
const Store = require('electron-store')
const store = new Store()
const { getLocalIPv4Address } = require('../server/networkUtils')
const { initializeSerialPort } = require('./serialCommunication')
const { scheduleExport } = require('./scheduleExports')

async function initializeApp(mainWindow) {
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

  // Initialiser le port série
  initializeSerialPort()

  // Planifier les exports
  scheduleExport()
}

module.exports = {
  initializeApp,
}
