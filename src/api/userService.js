import { fetchApi } from './axiosConfig'

// Fonction existante pour récupérer les informations des utilisateurs
async function getCompanyInfo() {
  try {
    return await fetchApi('users')
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error)
    return []
  }
}

// Nouvelle fonction pour mettre à jour un utilisateur
async function updateUser(userInfo) {
  try {
    const updatedUser = await fetchApi(`users/${userInfo._id}`, 'PUT', userInfo)
    console.log('Utilisateur mis à jour avec succès:', updatedUser)
    return updatedUser // Retourner l'utilisateur mis à jour pour une utilisation ultérieure
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error)
    throw error // Relancer pour permettre une gestion d'erreur plus spécifique dans le composant
  }
}

async function getUserInfo(userId) {
  try {
    return await fetchApi(`users/${userId}`)
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de l'utilisateur ${userId}:`,
      error,
    )
    throw error // Relancer pour permettre une gestion d'erreur plus spécifique dans le composant
  }
}

export { getCompanyInfo, updateUser, getUserInfo }
