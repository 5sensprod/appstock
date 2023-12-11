import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import theme from './theme/theme'
import { ProductProvider } from './contexts/ProductContext'
import { CartProvider } from './contexts/CartContext'
import { CompanyInfoProvider } from './contexts/CompanyInfoContext'
import POSPage from './components/pages/POSPage'
import './index.css'

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CompanyInfoProvider>
        <CartProvider>
          <ProductProvider>
            <Router>
              <Routes>
                <Route path="/" element={<POSPage />} />
                {/* Autres routes ici */}
              </Routes>
            </Router>
          </ProductProvider>
        </CartProvider>
      </CompanyInfoProvider>
    </ThemeProvider>
  )
}

export default App
