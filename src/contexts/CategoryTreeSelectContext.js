import React, { createContext, useContext, useState } from 'react'

export const CategoryTreeSelectContext = createContext()

export const CategoryTreeSelectProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState({
    categoryId: null,
    categoryName: '',
    selectedCategoryIds: [],
  })

  const getChildCategoryIds = (categoryId, categories) => {
    const childIds = [categoryId]
    categories
      .filter((cat) => cat.parentId === categoryId)
      .forEach((child) => {
        childIds.push(...getChildCategoryIds(child._id, categories))
      })
    return childIds
  }

  const handleCategorySelect = (categoryId, categoryName, categories) => {
    const selectedCategoryIds = categoryId
      ? getChildCategoryIds(categoryId, categories)
      : []
    setSelectedCategory({ categoryId, categoryName, selectedCategoryIds })
  }

  const resetSelectedCategory = () => {
    setSelectedCategory({ categoryId: null, categoryName: '' })
  }

  return (
    <CategoryTreeSelectContext.Provider
      value={{ selectedCategory, handleCategorySelect, resetSelectedCategory }}
    >
      {children}
    </CategoryTreeSelectContext.Provider>
  )
}

// Création du hook personnalisé pour utiliser le contexte CategoryTreeSelectContext
export const useCategoryTreeSelect = () => {
  const context = useContext(CategoryTreeSelectContext)
  if (context === undefined) {
    throw new Error(
      'useCategoryTreeSelect must be used within a CategoryTreeSelectProvider',
    )
  }
  return context
}
