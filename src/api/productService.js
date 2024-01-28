import { fetchApi } from './axiosConfig'

async function getProducts() {
  try {
    return await fetchApi('products')
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return []
  }
}

async function uploadPhoto(formData) {
  try {
    console.log("Envoi de la requête d'upload...")
    const data = await fetchApi('upload', 'POST', formData)

    console.log('Données de la réponse :', data)

    // Vérifiez si la réponse contient les informations attendues
    if (data && data.message) {
      return data
    } else {
      throw new Error('La réponse du serveur n’est pas au format attendu.')
    }
  } catch (error) {
    console.error("Erreur lors de l'upload de la photo:", error)
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
}
