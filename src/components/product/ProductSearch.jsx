import React from 'react'

const ProductSearch = ({ searchTerm, handleSearchChange }) => (
  <input
    id="search-input"
    placeholder="Rechercher un produit"
    type="search"
    value={searchTerm}
    onChange={handleSearchChange}
  />
)

export default ProductSearch
