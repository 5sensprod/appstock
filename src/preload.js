const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (...args) => ipcRenderer.send(...args),
    receive: (channel, func) => {
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    },
    invoke: (...args) => ipcRenderer.invoke(...args),
  },
  getLocalIp: () => ipcRenderer.invoke('get-local-ip'),
  getStoredIp: () => ipcRenderer.invoke('get-stored-ip'),

  // Ajouter les méthodes WooCommerce
  woocommerce: {
    testConnection: () => ipcRenderer.invoke('test-woo-connection'),
    getStatus: () => ipcRenderer.invoke('get-woo-status'),
    syncProduct: (product) =>
      ipcRenderer.invoke('sync-product-to-woo', product),
  },
})
