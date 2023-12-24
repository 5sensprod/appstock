import React, { createContext, useState, useContext, useEffect } from 'react'
import {
  getCategories,
  updateCategory,
  deleteCategory,
} from '../api/categoryService'
import { useConfig } from './ConfigContext'

const CategoryContext = createContext()

export const useCategoryContext = () => useContext(CategoryContext)

export const CategoryProvider = ({ children }) => {
  const { baseUrl } = useConfig()
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await getCategories(baseUrl)
      setCategories(fetchedCategories)
    }

    // Établir une connexion SSE
    const eventSource = new EventSource(`${baseUrl}/api/events`)

    eventSource.onmessage = (event) => {
      const { type, category, id } = JSON.parse(event.data)

      switch (type) {
        case 'category-added':
          setCategories((prevCategories) => [...prevCategories, category])
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
        // Gérer d'autres types d'événements si nécessaire
        default:
          break
      }
    }

    loadCategories()

    // Nettoyer la connexion SSE à la désinscription du composant
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
