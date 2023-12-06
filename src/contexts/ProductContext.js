import React, { createContext, useState, useContext } from 'react'

// Création du contexte
const ProductContext = createContext()

// Hook personnalisé pour un accès facile au contexte
export const useProductContext = () => useContext(ProductContext)

// Provider du contexte
export const ProductProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [categories, setCategories] = useState([])

  // Toutes les données et fonctions à partager
  const contextValue = {
    searchTerm,
    setSearchTerm,
    selectedCategoryId,
    setSelectedCategoryId,
    categories,
    setCategories,
  }

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  )
}
