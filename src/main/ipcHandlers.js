const { ipcMain, BrowserWindow, shell } = require('electron')
const { sendToLcd } = require('./serialCommunication')
const { exportBackupToSftp } = require('./sftpBackup')
const { printContent } = require('./printUtils')
const { getLocalIPv4Address } = require('../server/utils/networkUtils')
const Store = require('electron-store')
const store = new Store()

function setupIpcHandlers(mainWindow) {
  // Handlers existants...
  ipcMain.on('print', async (event, content) => {
    await printContent(content)
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

  ipcMain.on('update-lcd', (event, data) => {
    sendToLcd(data)
  })

  ipcMain.handle('get-local-ip', async () => {
    return getLocalIPv4Address()
  })

  ipcMain.handle('get-stored-ip', (event) => {
    return store.get('localIp')
  })
}

module.exports = { setupIpcHandlers }
