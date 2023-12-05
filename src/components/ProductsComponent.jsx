import React, { useState, useEffect } from 'react'
import fetchProducts from '../api/productsService'
import { getLocalIp } from '../ipcHelper'

const ProductsComponent = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    getLocalIp().then((localIp) => {
      fetchProducts(localIp)
        .then((data) => {
          setProducts(data)
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des produits:', error)
        })
    })
  }, [])

  return (
    <div>
      <h1>Produits</h1>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.reference} - {product.description}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProductsComponent
