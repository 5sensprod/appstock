import React, { useState, useEffect } from 'react'

const ProductsComponent = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    // Utilisation de l'API exposée par le script de preload
    window.api
      .fetchProducts()
      .then((data) => {
        setProducts(data)
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des produits:', error)
      })
  }, [])

  return (
    <div>
      <h1>Produits</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.description}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProductsComponent
