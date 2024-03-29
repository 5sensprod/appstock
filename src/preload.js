const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args))
  },
  getLocalIp: () => ipcRenderer.invoke('get-local-ip'),
  getStoredIp: () => ipcRenderer.invoke('get-stored-ip'),
})
