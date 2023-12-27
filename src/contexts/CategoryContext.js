import React, { createContext, useState, useContext, useEffect } from 'react'
import {
  getCategories,
  updateCategory,
  deleteCategory,
  fetchSubCategoryCounts,
  fetchProductCountByCategory,
  addCategory,
} from '../api/categoryService'
import { useConfig } from './ConfigContext'

const CategoryContext = createContext()

export const useCategoryContext = () => useContext(CategoryContext)

export const CategoryProvider = ({ children }) => {
  const { baseUrl } = useConfig()
  const [categories, setCategories] = useState([])
  const [subCategoryCounts, setSubCategoryCounts] = useState([])
  const [productCountByCategory, setProductCountByCategory] = useState({})

  useEffect(() => {
    const loadCategoriesAndCounts = async () => {
      try {
        const fetchedCategories = await getCategories(baseUrl)
        setCategories(fetchedCategories)

        const subCounts = await fetchSubCategoryCounts(baseUrl)
        setSubCategoryCounts(subCounts)

        // Chargement du comptage des produits par catégorie
        const productCounts = await fetchProductCountByCategory(baseUrl)
        setProductCountByCategory(productCounts)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      }
    }

    // Écoute de l'événement de mise à jour du produit
    const onProductUpdated = () => {
      loadCategoriesAndCounts()
    }

    document.addEventListener('productUpdated', onProductUpdated)

    // Établir une connexion SSE
    const eventSource = new EventSource(`${baseUrl}/api/events`)

    eventSource.onmessage = (event) => {
      const {
        type,
        category,
        id,
        subCategoryCounts: updatedSubCounts,
        productCountByCategory: updatedProductCounts,
      } = JSON.parse(event.data)

      switch (type) {
        case 'category-added':
          setCategories((prevCategories) => [...prevCategories, category])
          loadCategoriesAndCounts()
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
          setSubCategoryCounts(updatedSubCounts)
          break
        case 'productCountByCategory-updated':
          setProductCountByCategory(updatedProductCounts)
          break
        // Ajouter des cas pour d'autres types d'événements si nécessaire
        default:
          break
      }
    }

    loadCategoriesAndCounts()

    // Nettoyage des écouteurs d'événements et de la connexion SSE
    return () => {
      document.removeEventListener('productUpdated', onProductUpdated)
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

  const addCategoryToContext = async (categoryData) => {
    try {
      const newCategory = await addCategory(categoryData, baseUrl)
      setCategories((prevCategories) => [...prevCategories, newCategory])
      // Pas besoin d'appeler loadCategoriesAndCounts ici
      // car l'ajout d'une catégorie déclenchera un événement SSE qui mettra à jour les données
    } catch (error) {
      console.error('Erreur lors de l’ajout de la catégorie:', error)
      throw error
    }
  }

  const contextValue = {
    categories,
    subCategoryCounts,
    productCountByCategory,
    updateCategoryInContext,
    deleteCategoryFromContext,
    addCategoryToContext,
  }

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  )
}

export default CategoryProvider
