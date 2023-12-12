import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import theme from './theme/theme'
import { ProductProvider } from './contexts/ProductContext'
import { CartProvider } from './contexts/CartContext'
import { CompanyInfoProvider } from './contexts/CompanyInfoContext'
import { UIProvider } from './contexts/UIContext'
import POSPage from './components/pages/POSPage'
import DashboardPage from './components/pages/DashboardPage'
import CatalogPage from './components/pages/CatalogPage'
import CategoryPage from './components/pages/CategoryPage'
import ClientPage from './components/pages/ClientPage'
import InvoicePage from './components/pages/InvoicePage'
import MainLayout from './components/layout/MainLayout'
import CreateProductPage from './components/pages/CreateProductPage'
import EditProductPage from './components/pages/EditProductPage'

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <UIProvider>
        <CompanyInfoProvider>
          <CartProvider>
            <ProductProvider>
              <Router>
                <MainLayout>
                  {' '}
                  {/* Utilisez MainLayout ici */}
                  <Routes>
                    <Route path="/" element={<POSPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/catalog" element={<CatalogPage />} />
                    <Route path="/category" element={<CategoryPage />} />
                    <Route path="/client" element={<ClientPage />} />
                    <Route path="/invoice" element={<InvoicePage />} />
                    <Route
                      path="/create-product"
                      element={<CreateProductPage />}
                    />
                    <Route
                      path="/edit-product/:id"
                      element={<EditProductPage />}
                    />
                    {/* Autres routes ici */}
                  </Routes>
                </MainLayout>
              </Router>
            </ProductProvider>
          </CartProvider>
        </CompanyInfoProvider>
      </UIProvider>
    </ThemeProvider>
  )
}

export default App
