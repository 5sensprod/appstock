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
import { EventEmitter } from '../utils/eventEmitter'

const CategoryContext = createContext()

export const useCategoryContext = () => useContext(CategoryContext)

export const CategoryProvider = ({ children }) => {
  const { baseUrl } = useConfig()
  const [categories, setCategories] = useState([])
  const [subCategoryCounts, setSubCategoryCounts] = useState([])
  const [productCountByCategory, setProductCountByCategory] = useState({})
  const [selectedCategoryId, setSelectedCategoryId] = useState('')

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

  useEffect(() => {
    loadCategoriesAndCounts() // Charge initialement les catégories et les comptages

    const onProductCrudOperation = () => {
      loadCategoriesAndCounts() // Recharge les catégories et les comptages en réponse à l'événement
    }

    EventEmitter.subscribe('PRODUCT_CRUD_OPERATION', onProductCrudOperation)

    return () => {
      EventEmitter.unsubscribe('PRODUCT_CRUD_OPERATION', onProductCrudOperation)
    }
  }, [])

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
    } catch (error) {
      console.error('Erreur lors de l’ajout de la catégorie:', error)
      throw error
    }
  }

  const handleCategoryChange = (event) => {
    setSelectedCategoryId(event.target.value)
  }

  const contextValue = {
    categories,
    setCategories,
    subCategoryCounts,
    productCountByCategory,
    updateCategoryInContext,
    deleteCategoryFromContext,
    addCategoryToContext,
    selectedCategoryId,
    setSelectedCategoryId,
  }

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  )
}

export default CategoryProvider
