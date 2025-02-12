const { ipcMain, BrowserWindow, shell } = require('electron')
const { sendToLcd } = require('./serialCommunication')
const { exportBackupToSftp } = require('./sftpBackup')
const { printContent } = require('./printUtils')
const { getLocalIPv4Address } = require('../server/networkUtils')
const Store = require('electron-store')
const store = new Store()
// Importer le gestionnaire WooCommerce
const { initializeWooCommerce, testConnection } = require('./wooManager')

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

  // Nouveaux handlers WooCommerce
  ipcMain.handle('test-woo-connection', async () => {
    return await testConnection()
  })

  ipcMain.handle('get-woo-status', () => {
    return {
      isInitialized: initializeWooCommerce(),
      config: store.get('woocommerce'),
    }
  })

  // Handler pour synchroniser un produit
  ipcMain.handle('sync-product-to-woo', async (event, product) => {
    try {
      const wooApi = await getApi()
      if (!wooApi) throw new Error('WooCommerce non initialisé')

      const result = await wooApi.post('products', {
        name: product.name,
        regular_price: product.prixVente.toString(),
        description: product.description || '',
        stock_quantity: product.stock || 0,
        manage_stock: true,
      })

      return result.data
    } catch (error) {
      console.error('Erreur de synchronisation:', error)
      throw error
    }
  })
}

module.exports = { setupIpcHandlers }
