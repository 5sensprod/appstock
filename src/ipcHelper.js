// ipcHelper.js
export const getLocalIp = async () => {
  if (window.electron) {
    try {
      // Utiliser la méthode IPC exposée pour récupérer l'adresse IP stockée
      const storedIp = await window.electron.getStoredIp()
      return storedIp || 'default-local-ip' // Utiliser une valeur par défaut si 'storedIp' est null ou undefined
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'adresse IP locale:",
        error,
      )
      return 'default-local-ip' // Une valeur par défaut en cas d'erreur
    }
  } else {
    console.log(
      "Contexte Electron non disponible. Utilisation d'une adresse IP de secours.",
    )
    return 'localhost' // Une adresse IP de secours ou une autre logique
  }
}

export const sendPrintRequest = async (printContent) => {
  if (window.electron) {
    try {
      // Envoyer la demande d'impression au processus principal
      await window.electron.ipcRenderer.send('print', printContent)
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande d'impression:", error)
    }
  } else {
    console.log(
      "Contexte Electron non disponible. Impossible d'envoyer la demande d'impression.",
    )
  }
}

export const getPaths = async () => {
  if (window.electron) {
    try {
      const paths = await window.electron.ipcRenderer.invoke('get-paths')
      return paths // Retourne les chemins récupérés
    } catch (error) {
      console.error('Erreur lors de la récupération des chemins:', error)
      return null // Retourne null en cas d'erreur
    }
  } else {
    console.log('Contexte Electron non disponible.')
    return null // Une valeur de secours ou une autre logique
  }
}

export const triggerDirectExport = async () => {
  if (window.electron) {
    try {
      const { dbPaths } = await getPaths()
      for (const [dbName, dbPath] of Object.entries(dbPaths)) {
        await window.electron.ipcRenderer.invoke(
          'export-directly',
          dbPath,
          dbName,
        )
      }
    } catch (error) {
      console.error("Erreur lors de l'exportation directe:", error)
      throw error
    }
  } else {
    console.log('Contexte Electron non disponible.')
  }
}
