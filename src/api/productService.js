import { fetchApi } from './axiosConfig'

async function getProducts() {
  try {
    return await fetchApi('products')
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return []
  }
}

async function uploadPhoto(formData, productId) {
  try {
    const response = await fetchApi(
      `products/${productId}/upload`,
      'POST',
      formData,
    )

    // Si la réponse du serveur est OK (statut HTTP 2xx), renvoyez les données
    if (response.ok) {
      return { ok: true, data: response.data }
    } else {
      // Si le statut HTTP n'est pas 2xx, renvoyez le message d'erreur
      const errorData = await response.json()
      return { ok: false, errorData }
    }
  } catch (error) {
    console.error("Erreur lors de l'upload de la photo:", error)
    // Retournez l'erreur pour un traitement ultérieur
    return { ok: false, error: error.message }
  }
}

async function addProduct(productData) {
  try {
    // Assurez-vous que prixVente, prixAchat et stock sont des nombres
    const formattedData = {
      ...productData,
      prixVente: parseFloat(productData.prixVente) || 0,
      prixAchat: parseFloat(productData.prixAchat) || 0,
      stock: parseInt(productData.stock, 10) || 0,
      tva: parseFloat(productData.tva) || 20,
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

async function getProductCountByCategory() {
  try {
    return await fetchApi('products/countByCategory')
  } catch (error) {
    console.error(
      'Erreur lors de la récupération du nombre de produits par catégorie:',
      error,
    )
    return {}
  }
}

export {
  getProducts,
  addProduct,
  updateProduct,
  updateProductsBulk,
  deleteProduct,
  getProductCountByCategory,
  uploadPhoto,
}
