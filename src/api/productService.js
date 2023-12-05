import { fetchApi } from './axiosConfig' // Assurez-vous que le chemin est correct

async function getProducts() {
  try {
    return await fetchApi('products')
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return []
  }
}

export default getProducts
