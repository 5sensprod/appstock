import React from 'react'
import { productFactory } from '../factory/productFactory'
import { useProductContext } from '../../contexts/ProductContext'

const ProductGallery = ({ products }) => {
  const { baseUrl } = useProductContext()

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {products.map((product) => (
        <div key={product._id}>
          {productFactory(
            product._id,
            product.reference,
            product.descriptionCourte,
            product.prixVente,
            product.photos,
            product.categorie,
            baseUrl,
          ).render()}
        </div>
      ))}
    </div>
  )
}

export default ProductGallery
