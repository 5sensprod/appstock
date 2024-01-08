import React, { createContext, useContext, useState } from 'react'

// Création du contexte
const GridPreferenceContext = createContext()

// Provider du contexte
export const GridPreferenceProvider = ({ children }) => {
  // Définition de l'état initial des préférences

  const [gridPreferences, setGridPreferences] = useState({
    pageSize: 10,
    columnsVisibility: {}, // Pour les colonnes cachées
    sortModel: [],
    density: 'comfortable', // 'compact', 'standard', 'comfortable'
    quickFilterText: '', // Pour le GridToolbarQuickFilter
    // ... autres préférences
  })

  // Fonction pour mettre à jour les préférences
  const updatePreferences = (newPreferences) => {
    setGridPreferences((prevPreferences) => {
      const updatedPreferences = { ...prevPreferences, ...newPreferences }
      console.log('Mise à jour des préférences :', updatedPreferences)
      return updatedPreferences
    })
  }

  return (
    <GridPreferenceContext.Provider
      value={{ gridPreferences, updatePreferences }}
    >
      {children}
    </GridPreferenceContext.Provider>
  )
}

// Hook pour utiliser le contexte
export const useGridPreferences = () => {
  const context = useContext(GridPreferenceContext)
  if (context === undefined) {
    throw new Error(
      'useGridPreferences must be used within a GridPreferenceProvider',
    )
  }
  return context
}
