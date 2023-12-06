// src/api/categoryService.js
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

export { getCategories, addCategory }
