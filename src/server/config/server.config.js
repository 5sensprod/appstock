const path = require('path')
const electron = require('electron')

const userDataPath = (electron.app || electron.remote.app).getPath('userData')

const config = {
  port: 5000,
  cors: {
    origin: '*',
  },
  paths: {
    static: path.join(__dirname, '..', 'renderer', 'main_window'),
    catalogue: path.join(userDataPath, 'catalogue'),
  },
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['.png', '.jpg', '.jpeg', '.webp'],
  },
  sse: {
    retryTimeout: 10000,
  },
}

module.exports = config
