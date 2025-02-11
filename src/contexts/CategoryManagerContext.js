// src/contexts/CategoryManagerContext.js
import React, { createContext, useContext, useState, useCallback } from 'react'
import categoryClientService from '../services/categoryClientService'

const CategoryManagerContext = createContext(null)

export const CategoryManagerProvider = ({ children }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [syncStatus, setSyncStatus] = useState({
    lastSync: null,
    isSyncing: false,
  })

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await categoryClientService.listCategories()
      setCategories(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createCategory = useCallback(
    async (categoryData) => {
      try {
        setLoading(true)
        setError(null)
        const newCategory =
          await categoryClientService.createAndSync(categoryData)
        await fetchCategories()
        return newCategory
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchCategories],
  )

  const syncFromWoo = useCallback(async () => {
    try {
      setSyncStatus((prev) => ({ ...prev, isSyncing: true }))
      setError(null)
      await categoryClientService.syncFromWoo()
      await fetchCategories()
      setSyncStatus((prev) => ({
        isSyncing: false,
        lastSync: new Date().toISOString(),
      }))
    } catch (err) {
      setError(err.message)
      setSyncStatus((prev) => ({ ...prev, isSyncing: false }))
      throw err
    }
  }, [fetchCategories])

  const syncToWoo = useCallback(
    async (categoryId) => {
      try {
        setSyncStatus((prev) => ({ ...prev, isSyncing: true }))
        setError(null)
        await categoryClientService.syncToWoo(categoryId)
        await fetchCategories()
        setSyncStatus((prev) => ({
          isSyncing: false,
          lastSync: new Date().toISOString(),
        }))
      } catch (err) {
        setError(err.message)
        setSyncStatus((prev) => ({ ...prev, isSyncing: false }))
        throw err
      }
    },
    [fetchCategories],
  )

  const buildCategoryHierarchy = useCallback(
    (parentId = null) => {
      return categories
        .filter((cat) => cat.parent_id === parentId)
        .map((cat) => ({
          ...cat,
          children: buildCategoryHierarchy(cat._id),
        }))
    },
    [categories],
  )

  const value = {
    categories,
    loading,
    error,
    syncStatus,
    fetchCategories,
    createCategory,
    syncFromWoo,
    syncToWoo,
    buildCategoryHierarchy,
  }

  return (
    <CategoryManagerContext.Provider value={value}>
      {children}
    </CategoryManagerContext.Provider>
  )
}

export const useCategoryManager = () => {
  const context = useContext(CategoryManagerContext)
  if (!context) {
    throw new Error(
      'useCategoryManager must be used within a CategoryManagerProvider',
    )
  }
  return context
}
