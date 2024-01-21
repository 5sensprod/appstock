const path = require('path')
const fse = require('fs-extra')
const SFTPClient = require('ssh2-sftp-client')
const sftp = new SFTPClient()

module.exports = async function backupDatabase(dbPath, backupDir, dbName) {
  const currentDate = new Date()
  const formattedDate = currentDate.toISOString().split('T')[0] // format YYYY-MM-DD
  const backupFileName = `${dbName}-backup-${formattedDate}.db`
  const backupFilePath = path.join(backupDir, backupFileName)

  // Logique de sauvegarde locale
  console.log('Backup file path:', backupFilePath)
  fse.copySync(dbPath, backupFilePath)
  console.log('Database backup was successful for', dbName)

  // Configuration du serveur SFTP
  const serverConfig = {
    host: 'home707643575.1and1-data.host',
    port: '22', // Port SFTP standard
    username: 'u91084578',
    password: 'RyBcQBXt@1@',
  }

  const remoteBackupPath = `/axe_backup/${backupFileName}`

  // Logique de transfert SFTP
  try {
    await sftp.connect(serverConfig)
    await sftp.put(backupFilePath, remoteBackupPath)
    console.log('Sauvegarde transférée avec succès au serveur distant.')
  } catch (err) {
    console.error('Erreur lors du transfert de la sauvegarde:', err)
    throw err
  } finally {
    await sftp.end()
  }
}
