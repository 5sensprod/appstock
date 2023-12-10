import { fetchApi } from './axiosConfig'

async function getCompanyInfo() {
  try {
    return await fetchApi('users')
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return []
  }
}

export { getCompanyInfo }
