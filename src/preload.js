const { contextBridge, ipcRenderer } = require('electron')
const { getLocalIPv4Address } = require('./server/networkUtils')

contextBridge.exposeInMainWorld('electronAPI', {
  getLocalIPv4Address: () => Promise.resolve(getLocalIPv4Address()),
})
