// src/main/sftpBackup.js

const SftpClient = require('electron-ssh2-sftp-client')
const path = require('path')
const config = require('../../config.json')
const logToFile = require('./logger')

function formatDateTime() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  // Combine date and time into a single string
  return `${year}${month}${day}-${hours}${minutes}${seconds}`
}

async function exportBackupToSftp(dbPath, dbName) {
  const sftp = new SftpClient()
  const formattedDateTime = formatDateTime()
  const backupFileName = `${formattedDateTime}-${path.basename(dbPath)}`
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

module.exports = {
  exportBackupToSftp,
}
