import React, { createContext, useContext, useState } from 'react'

const GridPreferenceContext = createContext()

export const GridPreferenceProvider = ({ children }) => {
  // Définition de l'état initial des préférences
  const [searchTerm, setSearchTerm] = useState('')

  const [gridPreferences, setGridPreferences] = useState({
    paginationModel: {
      pageSize: 10,
      page: 0,
    },
    pageSize: 10,
    columnsVisibility: {}, // Pour les colonnes cachées
    sortModel: [],
    density: 'standard', // 'compact', 'standard', 'comfortable'
    quickFilterText: '',
    // ... autres préférences
  })

  // Fonction pour mettre à jour les préférences
  const updatePreferences = (newPreferences) => {
    setGridPreferences((prevPreferences) => {
      const updatedPreferences = { ...prevPreferences, ...newPreferences }
      return updatedPreferences
    })
  }

  return (
    <GridPreferenceContext.Provider
      value={{ gridPreferences, updatePreferences, searchTerm, setSearchTerm }}
    >
      {children}
    </GridPreferenceContext.Provider>
  )
}

export const useGridPreferences = () => {
  const context = useContext(GridPreferenceContext)
  if (context === undefined) {
    throw new Error(
      'useGridPreferences must be used within a GridPreferenceProvider',
    )
  }
  return context
}
