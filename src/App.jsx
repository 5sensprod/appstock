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
import MobilPage from './components/pages/MobilPage'
import ProductPage from './components/pages/ProductPage'
import { LicenseManager } from 'ag-grid-enterprise'
import { LicenseInfo } from '@mui/x-data-grid-pro'
import { ConfigProvider } from './contexts/ConfigContext'
import { CategoryProvider } from './contexts/CategoryContext'
import { ProductProviderSimplified } from './contexts/ProductContextSimplified'

const licenseKey =
  'CompanyName=Equinix Asia Pacific pte ltd,LicensedGroup=equinixMendixPrivateLib,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=2,LicensedProductionInstancesCount=0,AssetReference=AG-027567,SupportServicesEnd=18_June_2023_[v2]_MTY4NzA0MjgwMDAwMA==4be2c388f9a8a7443c72842dff53d5b2'
LicenseManager.setLicenseKey(licenseKey)

LicenseInfo.setLicenseKey(
  'x0jTPl0USVkVZV0SsMjM1kDNyADM5cjM2ETPZJVSQhVRsIDN0YTM6IVREJ1T0b9586ef25c9853decfa7709eee27a1e',
)

const App = () => {
  const isAndroidWebView = navigator.userAgent.toLowerCase().includes('wv')

  return (
    <ThemeProvider theme={theme}>
      <ConfigProvider>
        <UIProvider>
          <CompanyInfoProvider>
            <CartProvider>
              <ProductProviderSimplified>
                <ProductProvider>
                  <CategoryProvider>
                    <Router>
                      {isAndroidWebView ? (
                        // Affichage pour WebView Android
                        <Routes>
                          <Route path="/mobil" element={<MobilPage />} />
                          {/* Ajoutez ici d'autres routes si nécessaire pour WebView */}
                        </Routes>
                      ) : (
                        // Affichage normal avec MainLayout
                        <MainLayout>
                          <Routes>
                            <Route path="/" element={<POSPage />} />
                            <Route
                              path="/dashboard"
                              element={<DashboardPage />}
                            />
                            <Route path="/catalog" element={<CatalogPage />} />
                            {/* <Route
                            path="/products/:productIds?/:categoryId?"
                            element={<ProductPage />}
                          /> */}
                            <Route path="/products" element={<ProductPage />} />
                            <Route
                              path="/category"
                              element={<CategoryPage />}
                            />
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
                            {/* La route /mobil est accessible uniquement dans WebView */}
                          </Routes>
                        </MainLayout>
                      )}
                    </Router>
                  </CategoryProvider>
                </ProductProvider>
              </ProductProviderSimplified>
            </CartProvider>
          </CompanyInfoProvider>
        </UIProvider>
      </ConfigProvider>
    </ThemeProvider>
  )
}

export default App
