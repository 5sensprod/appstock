import React from 'react'
import { useParams } from 'react-router-dom'
import ProductDetailsGrid from '../product/ProductDetailsGrid'

const ProductDetailsPage = () => {
  const { productIds } = useParams()
  const idsArray = productIds.split(',')

  return (
    <div>
      <ProductDetailsGrid productIds={idsArray} />
    </div>
  )
}

export default ProductDetailsPage
