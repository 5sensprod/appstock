import React from 'react'
import { TextField, IconButton } from '@mui/material'
import { useProductContext } from '../../contexts/ProductContext'
import CloseIcon from '@mui/icons-material/Close'
import { useGridPreferences } from '../../contexts/GridPreferenceContext' // Assurez-vous que c'est le bon chemin d'accès

const ProductSearch = () => {
  const { searchTerm, setSearchTerm } = useProductContext()
  const { resetCurrentPage } = useGridPreferences() // Utilisez useGridPreferences ici

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    resetCurrentPage() // Réinitialisez la page courante à 1 lors de la modification de la recherche
  }

  return (
    <div>
      <TextField
        size="small"
        label="Rechercher un produit"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={resetCurrentPage}
        fullWidth
        InputProps={{
          endAdornment: searchTerm && (
            <IconButton
              onClick={() => {
                setSearchTerm('')
                resetCurrentPage()
              }}
              edge="end"
            >
              <CloseIcon />
            </IconButton>
          ),
        }}
      />
    </div>
  )
}

export default ProductSearch
