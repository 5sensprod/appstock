import React, { useState, useEffect } from 'react'
import useProducts from './hooks/useProducts'
import useSearch from './hooks/useSearch'

const ProductsComponent = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const products = useProducts()
  const filteredProducts = useSearch(products, searchTerm)

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }
  return (
    <div>
      <h1>Produits</h1>
      <input
        id="search-input"
        placeholder="Rechercher un produit"
        type="search"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <table>
        <thead>
          <tr>
            <th>Référence</th>
            <th>Marque</th>
            <th>Gencode</th>
            <th>Prix de vente</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id} style={{ cursor: 'pointer' }}>
              <td>{product.reference}</td>
              <td>{product.marque}</td>
              <td>{product.gencode}</td>
              <td>{product.prixVente} €</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductsComponent
