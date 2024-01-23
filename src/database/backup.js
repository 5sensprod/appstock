const path = require('path')
const fse = require('fs-extra')

module.exports = function backupDatabase(dbPath, backupDir, dbName) {
  const currentDate = new Date()
  const formattedDate = currentDate.toISOString().split('T')[0] // format YYYY-MM-DD
  const backupFileName = `backup-${dbName}-${formattedDate}.db`
  const backupPath = path.join(backupDir, backupFileName)

  console.log('Backup file path:', backupPath)
  fse.copySync(dbPath, backupPath)
  console.log('Database backup was successful!')
  return backupFileName
}
