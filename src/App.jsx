import React from 'react'
import { ThemeProvider, Grid, Box } from '@mui/material'
import theme from './theme/theme'
import { ProductProvider } from './contexts/ProductContext'
import ProductManager from './components/product/ProductManager'
import Cart from './components/Cart/Cart'
import { CartProvider } from './contexts/CartContext'
import { CompanyInfoProvider } from './contexts/CompanyInfoContext'
import './index.css' // Importez votre fichier CSS ici

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CompanyInfoProvider>
        <CartProvider>
          <ProductProvider>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <ProductManager />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Cart />
                </Grid>
              </Grid>
            </Box>
          </ProductProvider>
        </CartProvider>
      </CompanyInfoProvider>
    </ThemeProvider>
  )
}

export default App
