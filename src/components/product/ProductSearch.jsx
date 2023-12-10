import React from 'react'
import { TextField } from '@mui/material'
import { useProductContext } from '../../contexts/ProductContext'

const ProductSearch = () => {
  const { searchTerm, setSearchTerm } = useProductContext()

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  return (
    <div>
      <TextField
        id="search-input"
        label="Rechercher un produit"
        type="search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Rechercher un produit"
      />
    </div>
  )
}

export default ProductSearch
