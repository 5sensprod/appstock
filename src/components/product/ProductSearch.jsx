import React from 'react'
import { TextField, IconButton } from '@mui/material'
import { useProductContext } from '../../contexts/ProductContext'
import CloseIcon from '@mui/icons-material/Close'

const ProductSearch = () => {
  const { searchTerm, setSearchTerm } = useProductContext()

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  return (
    <div>
      <TextField
        label="Rechercher un produit"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        InputProps={{
          endAdornment: searchTerm && (
            <IconButton onClick={() => setSearchTerm('')} edge="end">
              <CloseIcon />
            </IconButton>
          ),
        }}
      />
    </div>
  )
}

export default ProductSearch
