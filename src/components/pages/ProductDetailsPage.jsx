// Dans ProductDetailsPage
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import ProductDetailsGrid from '../product/ProductDetailsGrid'
import CategoryWithChildren from '../category/CategoryWithChildren'
import CategoryTreeHighlight from '../category/CategoryTreeHighlight'
import { useProductContext } from '../../contexts/ProductContext'
import { useUI } from '../../contexts/UIContext'

const ProductDetailsPage = () => {
  const { productIds, categoryId } = useParams()
  const { updatePageTitle } = useUI()
  const { categories } = useProductContext()

  useEffect(() => {
    updatePageTitle('Les produits en détails')
  }, [updatePageTitle])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <CategoryTreeHighlight
          categoryId={categoryId}
          categories={categories}
        />
        <CategoryWithChildren categoryId={categoryId} />
      </Grid>
      <Grid item xs={12} md={9}>
        <ProductDetailsGrid productIds={productIds.split(',')} />
      </Grid>
    </Grid>
  )
}

export default ProductDetailsPage
