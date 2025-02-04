import { fetchApi } from './axiosConfig'

// Fonction utilitaire pour supprimer les espaces avant les données
const cleanData = (data) => {
  const cleanedData = {}
  for (const key in data) {
    if (typeof data[key] === 'string') {
      const cleaned = data[key].replace(/^\s+/, '')
      cleanedData[key] =
        key === 'name'
          ? cleaned
              .toLowerCase()
              .split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
          : cleaned
    } else {
      cleanedData[key] = data[key]
    }
  }
  return cleanedData
}

async function getCategories() {
  try {
    const categories = await fetchApi('categories')
    return categories.map((cat) => ({
      ...cat,
      name: cat.name
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    }))
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error)
    return []
  }
}
async function addCategory(categoryData) {
  try {
    const cleanedData = cleanData(categoryData)
    return await fetchApi('categories', 'POST', cleanedData)
  } catch (error) {
    console.error("Erreur lors de l'ajout de la catégorie:", error)
    throw error
  }
}

async function updateCategory(id, categoryData) {
  try {
    const cleanedData = cleanData(categoryData)
    return await fetchApi(`categories/${id}`, 'PUT', cleanedData)
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

async function fetchProductCountByCategory() {
  try {
    return await fetchApi('categories/productCountByCategory')
  } catch (error) {
    console.error(
      'Erreur lors de la récupération du nombre de produits par catégorie:',
      error,
    )
    throw error
  }
}

export {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  fetchSubCategoryCounts,
  fetchProductCountByCategory,
}
