import { fetchApi } from './axiosConfig'

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
    return await fetchApi('suppliers', 'POST', supplierData)
  } catch (error) {
    console.error("Erreur lors de l'ajout du fournisseur:", error)
    throw error
  }
}

async function updateSupplier(supplierId, supplierData) {
  try {
    return await fetchApi(`suppliers/${supplierId}`, 'PUT', supplierData)
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
