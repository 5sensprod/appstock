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

    // Log la réponse complète du serveur
    console.log('Réponse du serveur:', response)

    // Si la réponse est un succès, retournez la réponse
    if (response.message === 'Fichiers uploadés avec succès') {
      return response
    } else {
      // Si la réponse contient un autre message, il y a eu un problème
      throw new Error(
        response.message || 'Problème lors de l’upload du fichier',
      )
    }
  } catch (error) {
    console.error("Erreur lors de l'upload de la photo:", error)
    throw error
  }
}

async function uploadPhotoFromUrl(productId, imageUrl) {
  try {
    const response = await fetchApi(
      `products/${productId}/upload-url`,
      'POST',
      { imageUrl },
    )

    // Si la réponse est un succès, retournez simplement la réponse
    // Sans vérifier explicitement la propriété 'message'
    return response
  } catch (error) {
    console.error(
      "Erreur lors du téléchargement de l'image depuis l'URL:",
      error,
    )
    throw error
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
  uploadPhotoFromUrl,
}
