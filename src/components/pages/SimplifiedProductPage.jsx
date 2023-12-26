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
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {/* <ProductSearch /> */}
      </Grid>
      <Grid item xs={12}>
        <CategoryFilter
          onCategorySelect={setSelectedCategoryId}
          selectedCategoryId={selectedCategoryId}
        />
      </Grid>
      <Grid item xs={12}>
        <ProductsGrid selectedCategoryId={selectedCategoryId} />
      </Grid>
    </Grid>
  )
}

export default SimplifiedProductPage
