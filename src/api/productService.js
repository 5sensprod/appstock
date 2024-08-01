import { fetchApi } from './axiosConfig'

// Fonction utilitaire pour supprimer les espaces avant les données
const cleanData = (data) => {
  const cleanedData = {}
  for (const key in data) {
    if (typeof data[key] === 'string') {
      cleanedData[key] = data[key].replace(/^\s+/, '') // Supprimer les espaces avant
    } else {
      cleanedData[key] = data[key]
    }
  }
  return cleanedData
}

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
    const cleanedData = cleanData(productData)
    const formattedData = {
      ...cleanedData,
      prixVente: parseFloat(cleanedData.prixVente) || 0,
      prixAchat: parseFloat(cleanedData.prixAchat) || 0,
      stock: parseInt(cleanedData.stock, 10) || 0,
      tva: parseFloat(cleanedData.tva) || 20,
      supplierId: cleanedData.supplierId || null, // Ajout du champ supplierId
    }

    return await fetchApi('products', 'POST', formattedData)
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit:", error)
    throw error
  }
}

async function updateProduct(productId, productData) {
  try {
    const cleanedData = cleanData(productData)
    const formattedData = {
      ...cleanedData,
      supplierId: cleanedData.supplierId || null, // Ajout du champ supplierId
    }

    return await fetchApi(`products/${productId}`, 'PUT', formattedData)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error)
    throw error
  }
}

async function updateProductsBulk(productsData) {
  try {
    const cleanedDataArray = productsData.map((product) => cleanData(product))
    return await fetchApi('products/bulk-update', 'PUT', cleanedDataArray)
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
}
