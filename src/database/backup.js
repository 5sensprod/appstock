const path = require('path')
const fse = require('fs-extra')

module.exports = function backupDatabase(dbPath, backupDir) {
  const currentDate = new Date()
  const formattedDate = currentDate.toISOString().split('T')[0] // format YYYY-MM-DD
  const backupPath = path.join(backupDir, `backup-${formattedDate}.db`)

  console.log('Backup file path:', backupPath) // Affiche le chemin du fichier de sauvegarde
  fse.copySync(dbPath, backupPath)
  console.log('Database backup was successful!')
}
