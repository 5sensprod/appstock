import { fetchApi } from './axiosConfig'

async function getProducts() {
  try {
    return await fetchApi('products')
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return []
  }
}

async function addProduct(productData) {
  try {
    return await fetchApi('products', 'POST', productData)
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit:", error)
    throw error
  }
}

export { getProducts, addProduct }
