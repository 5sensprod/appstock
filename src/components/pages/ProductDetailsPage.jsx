// Dans ProductDetailsPage
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProductDetailsGrid from '../product/ProductDetailsGrid'
import CategoryWithChildren from '../category/CategoryWithChildren'
import { useUI } from '../../contexts/UIContext'

const ProductDetailsPage = () => {
  const { productIds, categoryId } = useParams()
  const { updatePageTitle } = useUI()

  useEffect(() => {
    updatePageTitle('Les produits en détails')
  }, [updatePageTitle])

  return (
    <div>
      <CategoryWithChildren categoryId={categoryId} />
      <ProductDetailsGrid productIds={productIds.split(',')} />
    </div>
  )
}

export default ProductDetailsPage
