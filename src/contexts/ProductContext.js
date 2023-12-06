import React, { createContext, useState, useContext } from 'react'

// Création du contexte
const ProductContext = createContext()

// Hook personnalisé pour un accès facile au contexte
export const useProductContext = () => useContext(ProductContext)

// Provider du contexte
export const ProductProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('')

  // Toutes les données et fonctions à partager
  const contextValue = {
    searchTerm,
    setSearchTerm,
  }

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  )
}
