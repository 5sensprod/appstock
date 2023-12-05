// ipcHelper.js
export const getLocalIp = async () => {
  if (window.electron) {
    try {
      return await window.electron.getLocalIp()
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
