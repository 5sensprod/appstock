// Dans src/components/pages/SimplifiedProductPage.jsx
import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import ProductsGrid from '../PRODUCTS/ProductsGrid'
import ProductSearch from '../PRODUCTS/ProductSearch'
import CategoryFilter from '../CATEGORIES/CategoryFilter'

const SimplifiedProductPage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ProductSearch />
      </Grid>
      <Grid item xs={12}>
        <CategoryFilter onCategorySelect={setSelectedCategoryId} />
      </Grid>
      <Grid item xs={12}>
        <ProductsGrid selectedCategoryId={selectedCategoryId} />
      </Grid>
    </Grid>
  )
}

export default SimplifiedProductPage
