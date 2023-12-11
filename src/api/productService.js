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
    // Assurez-vous que prixVente, prixAchat et stock sont des nombres
    const formattedData = {
      ...productData,
      prixVente: parseFloat(productData.prixVente) || 0,
      prixAchat: productData.prixAchat
        ? parseFloat(productData.prixAchat)
        : null,
      stock: productData.stock ? parseInt(productData.stock, 10) : null,
    }

    return await fetchApi('products', 'POST', formattedData)
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit:", error)
    throw error
  }
}

async function updateProduct(productId, productData) {
  try {
    return await fetchApi(`products/${productId}`, 'PUT', productData)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error)
    throw error
  }
}

async function updateProductsBulk(productsData) {
  try {
    return await fetchApi('products/bulk-update', 'PUT', productsData)
  } catch (error) {
    console.error('Erreur lors de la mise à jour en masse des produits:', error)
    throw error
  }
}

async function deleteProduct(productId) {
  try {
    return await fetchApi(`products/${productId}`, 'DELETE')
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error)
    throw error
  }
}

export {
  getProducts,
  addProduct,
  updateProduct,
  updateProductsBulk,
  deleteProduct,
}
