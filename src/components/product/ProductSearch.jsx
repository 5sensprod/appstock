import React from 'react'
import { useProductContext } from '../../contexts/ProductContext'

const ProductSearch = () => {
  const { searchTerm, setSearchTerm } = useProductContext()

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  return (
    <div>
      <input
        id="search-input"
        placeholder="Rechercher un produit"
        type="search"
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  )
}

export default ProductSearch
