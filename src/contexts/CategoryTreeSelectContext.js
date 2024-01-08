// src/contexts/CategoryTreeSelectContext.js
import React, { createContext, useState } from 'react'

export const CategoryTreeSelectContext = createContext()

export const CategoryTreeSelectProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState({
    categoryId: null,
    categoryName: '',
  })

  const handleCategorySelect = (categoryId, categoryName) => {
    setSelectedCategory({ categoryId, categoryName })
  }

  return (
    <CategoryTreeSelectContext.Provider
      value={{ selectedCategory, handleCategorySelect }}
    >
      {children}
    </CategoryTreeSelectContext.Provider>
  )
}
