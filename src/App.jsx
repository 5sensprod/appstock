import React from 'react'
import { Grid, Box } from '@mui/material'
import { ProductProvider } from './contexts/ProductContext'
import MyComponent from './MyComponent'
import ProductManager from './components/product/ProductManager'
import Cart from './components/Cart/Cart'
import { CartProvider } from './contexts/CartContext'
import { CompanyInfoProvider } from './contexts/CompanyInfoContext'

const App = () => {
  return (
    <CompanyInfoProvider>
      <CartProvider>
        <ProductProvider>
          <Box sx={{ margin: '32px' }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <ProductManager />
              </Grid>
              <Grid item xs={12} md={6}>
                <Cart />
              </Grid>
            </Grid>
          </Box>
        </ProductProvider>
      </CartProvider>
    </CompanyInfoProvider>
  )
}

export default App
