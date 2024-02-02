import React from 'react'
import { Grid } from '@mui/material'
import ProductManager from '../product/ProductManager'
import Cart from '../Cart/Cart'

const POSPage = () => {
  return (
    <Grid container spacing={1} mt={1}>
      <Grid item xs={12} md={6}>
        <ProductManager />
      </Grid>
      <Grid item xs={12} md={6}>
        <Cart />
      </Grid>
    </Grid>
  )
}

export default POSPage
