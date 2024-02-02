import React, { useContext, useState } from 'react'
import Grid from '@mui/material/Grid'
import ProductsGrid from '../PRODUCTS/ProductsGrid'
import CategoryFilter from '../CATEGORIES/CategoryFilter'
import { CategoryTreeSelectContext } from '../../contexts/CategoryTreeSelectContext'
import ProductSearch from '../PRODUCTS/ProductSearch'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'

const ProductPage = () => {
  const { selectedCategory } = useContext(CategoryTreeSelectContext)
  const { searchTerm } = useProductContextSimplified()

  return (
    <Grid container direction="column" spacing={1} mt={1}>
      <Grid item xs={12} md={6}>
        <CategoryFilter />
      </Grid>

      {/* Intégration du composant ProductSearch */}
      {/* <ProductSearch /> */}

      {/* ProductsGrid peut maintenant utiliser searchTerm pour filtrer les produits */}
      <Grid item xs={12} md={6}>
        <ProductsGrid
          selectedCategoryId={selectedCategory.categoryId}
          searchTerm={searchTerm}
        />
      </Grid>
    </Grid>
  )
}

export default ProductPage
