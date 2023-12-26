import React from 'react'
import { TextField, IconButton } from '@mui/material'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'
import CloseIcon from '@mui/icons-material/Close'

const ProductSearch = () => {
  const { searchTerm, setSearchTerm } = useProductContextSimplified()

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  return (
    <div>
      <TextField
        size="small"
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
