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
    <Grid container direction="column" spacing={2} mt={6}>
      <CategoryFilter />

      {/* Intégration du composant ProductSearch */}
      {/* <ProductSearch /> */}

      {/* ProductsGrid peut maintenant utiliser searchTerm pour filtrer les produits */}
      <ProductsGrid
        selectedCategoryId={selectedCategory.categoryId}
        searchTerm={searchTerm}
      />
    </Grid>
  )
}

export default ProductPage
