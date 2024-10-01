const schedule = require('node-schedule')
const { app } = require('electron')
const path = require('path')
const { exportBackupToSftp } = require('./sftpBackup')

function getDatabasePaths() {
  const userDataPath = app.getPath('userData')
  return {
    categories: path.join(userDataPath, 'categories.db'),
    users: path.join(userDataPath, 'users.db'),
    products: path.join(userDataPath, 'products.db'),
    invoices: path.join(userDataPath, 'invoices.db'),
    suppliers: path.join(userDataPath, 'suppliers.db'),
  }
}

function scheduleExport() {
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

module.exports = {
  scheduleExport,
}
