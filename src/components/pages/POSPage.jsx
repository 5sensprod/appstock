import React from 'react'
import { Grid } from '@mui/material'
import ProductManager from '../product/ProductManager'
import Cart from '../Cart/Cart'

const POSPage = () => {
  return (
    <Grid container spacing={2} mt={6}>
      <Grid item xs={12} md={8}>
        <ProductManager />
      </Grid>
      <Grid item xs={12} md={4}>
        <Cart />
      </Grid>
    </Grid>
  )
}

export default POSPage
