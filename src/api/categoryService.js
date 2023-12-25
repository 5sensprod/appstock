import { fetchApi } from './axiosConfig'

async function getCategories() {
  try {
    return await fetchApi('categories')
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error)
    return []
  }
}

async function addCategory(categoryData) {
  try {
    return await fetchApi('categories', 'POST', categoryData)
  } catch (error) {
    console.error("Erreur lors de l'ajout de la catégorie:", error)
    throw error
  }
}

async function updateCategory(id, categoryData) {
  try {
    return await fetchApi(`categories/${id}`, 'PUT', categoryData)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error)
    throw error
  }
}

async function deleteCategory(id) {
  try {
    return await fetchApi(`categories/${id}`, 'DELETE')
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error)
    throw error
  }
}

async function fetchSubCategoryCounts() {
  try {
    return await fetchApi('categories/subCategoryCount')
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des comptes des sous-catégories:',
      error,
    )
    return []
  }
}

export {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  fetchSubCategoryCounts,
}
