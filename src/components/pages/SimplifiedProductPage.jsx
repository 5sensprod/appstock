// Dans src/components/pages/SimplifiedProductPage.jsx
import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import ProductsGrid from '../PRODUCTS/ProductsGrid'
// import ProductSearch from '../PRODUCTS/ProductSearch'
import CategoryFilter from '../CATEGORIES/CategoryFilter'
import { useLocation } from 'react-router-dom'

const SimplifiedProductPage = () => {
  const location = useLocation()
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    location.state?.selectedCategoryId || null,
  )

  return (
    <Grid container direction="column" spacing={2} mt={6}>
      <CategoryFilter
        onCategorySelect={setSelectedCategoryId}
        selectedCategoryId={selectedCategoryId}
      />

      <ProductsGrid selectedCategoryId={selectedCategoryId} />
    </Grid>
  )
}

export default SimplifiedProductPage
