import React, { createContext, useState, useContext, useEffect } from 'react'
import {
  getCategories,
  updateCategory,
  deleteCategory,
  fetchSubCategoryCounts,
} from '../api/categoryService'
import { useConfig } from './ConfigContext'

const CategoryContext = createContext()

export const useCategoryContext = () => useContext(CategoryContext)

export const CategoryProvider = ({ children }) => {
  const { baseUrl } = useConfig()
  const [categories, setCategories] = useState([])
  const [subCategoryCounts, setSubCategoryCounts] = useState([])

  useEffect(() => {
    const loadCategoriesAndCounts = async () => {
      try {
        const fetchedCategories = await getCategories(baseUrl)
        setCategories(fetchedCategories)

        const counts = await fetchSubCategoryCounts(baseUrl)
        setSubCategoryCounts(counts)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      }
    }

    // Établir une connexion SSE
    const eventSource = new EventSource(`${baseUrl}/api/events`)

    eventSource.onmessage = (event) => {
      const {
        type,
        category,
        id,
        subCategoryCounts: updatedCounts,
      } = JSON.parse(event.data)

      switch (type) {
        case 'category-added':
          setCategories((prevCategories) => [...prevCategories, category])
          // Après l'ajout d'une catégorie, rechargez également les comptes de sous-catégories
          const loadSubCategoryCounts = async () => {
            const counts = await fetchSubCategoryCounts(baseUrl)
            setSubCategoryCounts(counts)
          }
          loadSubCategoryCounts()
          break
        case 'category-updated':
          setCategories((prevCategories) =>
            prevCategories.map((cat) =>
              cat._id === category._id ? { ...cat, ...category } : cat,
            ),
          )
          break
        case 'category-deleted':
          setCategories((prevCategories) =>
            prevCategories.filter((cat) => cat._id !== id),
          )
          break
        case 'subCategoryCounts-updated':
          // Mettre à jour les comptes de sous-catégories
          setSubCategoryCounts(updatedCounts)
          break
        // Gérer d'autres types d'événements si nécessaire
        default:
          break
      }
    }

    loadCategoriesAndCounts()

    // Nettoyer la connexion SSE
    return () => {
      eventSource.close()
    }
  }, [baseUrl])

  const updateCategoryInContext = async (id, categoryData) => {
    try {
      await updateCategory(id, categoryData, baseUrl)
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat._id === id ? { ...cat, ...categoryData } : cat,
        ),
      )
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error)
      throw error
    }
  }

  const deleteCategoryFromContext = async (categoryId) => {
    try {
      await deleteCategory(categoryId, baseUrl)
      setCategories((prevCategories) =>
        prevCategories.filter((cat) => cat._id !== categoryId),
      )
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error)
      throw error
    }
  }

  const contextValue = {
    categories,
    subCategoryCounts,
    updateCategoryInContext,
    deleteCategoryFromContext,
  }

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  )
}

export default CategoryProvider
