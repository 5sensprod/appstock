import React, { useContext } from 'react'
import Grid from '@mui/material/Grid'
import ProductsGrid from '../PRODUCTS/ProductsGrid'
import CategoryFilter from '../CATEGORIES/CategoryFilter'
import { CategoryTreeSelectContext } from '../../contexts/CategoryTreeSelectContext'

const ProductPage = () => {
  const { selectedCategory } = useContext(CategoryTreeSelectContext)

  return (
    <Grid container direction="column" spacing={2} mt={6}>
      <CategoryFilter />

      <ProductsGrid selectedCategoryId={selectedCategory.categoryId} />
    </Grid>
  )
}

export default ProductPage
