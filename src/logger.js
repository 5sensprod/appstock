// logger.js
const fs = require('fs')
const path = require('path')
const app = require('electron').app

const logFile = path.join(app.getPath('desktop'), 'appLogs.txt')

function logToFile(message) {
  fs.appendFileSync(logFile, message + '\n', 'utf-8')
}

module.exports = logToFile
