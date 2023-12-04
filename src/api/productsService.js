async function getApiUrl() {
  try {
    const localIp = await window.api.getLocalIPv4Address()
    const port = 5000
    return `http://${localIp}:${port}/api`
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'adresse IP locale:",
      error,
    )
    return null
  }
}

async function fetchProducts() {
  try {
    const apiUrl = await getApiUrl()
    if (!apiUrl) {
      throw new Error("Impossible de récupérer l'URL de l'API")
    }

    const response = await fetch(`${apiUrl}/products`)
    if (!response.ok) {
      throw new Error(`Erreur réseau: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return []
  }
}
