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

async function getSuppliers() {
  try {
    return await fetchApi('suppliers')
  } catch (error) {
    console.error('Erreur lors de la récupération des fournisseurs:', error)
    return []
  }
}

async function addSupplier(supplierData) {
  try {
    const cleanedData = cleanData(supplierData)
    return await fetchApi('suppliers', 'POST', cleanedData)
  } catch (error) {
    console.error("Erreur lors de l'ajout du fournisseur:", error)
    throw error
  }
}

async function updateSupplier(supplierId, supplierData) {
  try {
    const cleanedData = cleanData(supplierData)
    return await fetchApi(`suppliers/${supplierId}`, 'PUT', cleanedData)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du fournisseur:', error)
    throw error
  }
}

async function deleteSupplier(supplierId) {
  try {
    return await fetchApi(`suppliers/${supplierId}`, 'DELETE')
  } catch (error) {
    console.error('Erreur lors de la suppression du fournisseur:', error)
    throw error
  }
}

export { getSuppliers, addSupplier, updateSupplier, deleteSupplier }
