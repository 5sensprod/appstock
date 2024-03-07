import React, { createContext, useContext, useState } from 'react'

export const CategoryTreeSelectContext = createContext()

export const CategoryTreeSelectProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState({
    categoryId: null,
    categoryName: '',
  })

  const handleCategorySelect = (categoryId, categoryName) => {
    setSelectedCategory({ categoryId, categoryName })
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
