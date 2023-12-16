import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProductDetailsGrid from '../product/ProductDetailsGrid'
import { useUI } from '../../contexts/UIContext'

const ProductDetailsPage = () => {
  const { productIds } = useParams()
  const { updatePageTitle } = useUI()
  const idsArray = productIds.split(',')

  useEffect(() => {
    updatePageTitle('Les produits en détails')
  }, [updatePageTitle])

  return (
    <div>
      <ProductDetailsGrid productIds={idsArray} />
    </div>
  )
}

export default ProductDetailsPage
