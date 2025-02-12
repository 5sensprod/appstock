import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductContext } from '../../contexts/ProductContext'
import ProductSearch from '../productPOS/ProductSearch'
import useSearch from '../hooks/useSearch'
import ProductCatalog from '../productPOS/ProductCatalog'
import { Box, Button, Snackbar, Alert } from '@mui/material'
import { useCategoryContext } from '../../contexts/CategoryContext'
import WooCommerceConfig from '../woocommerce/WooCommerceConfig'
import CategoryFilter from '../CATEGORIES/CategoryFilter'
import { CategoryTreeSelectContext } from '../../contexts/CategoryTreeSelectContext'

const CatalogPage = () => {
  const { products, searchTerm } = useProductContext()

  const { categories } = useCategoryContext()
  const [wooStatus, setWooStatus] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [showWooConfig, setShowWooConfig] = useState(false)

  const { selectedCategory } = useContext(CategoryTreeSelectContext)

  const filteredProducts = useSearch(
    products,
    searchTerm,
    null,
    categories,
  ).filter((product) => {
    if (!selectedCategory?.categoryId) return true
    return selectedCategory.selectedCategoryIds.includes(product.categorie)
  })

  const navigate = useNavigate()

  const testWoo = async () => {
    try {
      const status = await window.electron.woocommerce.testConnection()
      console.log('Statut WooCommerce:', status)

      if (!status.success && status.message.includes('configurer')) {
        setShowWooConfig(true)
        return
      }

      setWooStatus(status)
      setShowAlert(true)
    } catch (error) {
      console.error('Erreur:', error)
      setWooStatus({
        success: false,
        message: error.message || 'Erreur lors du test de connexion',
      })
      setShowAlert(true)
    }
  }

  const redirectToEdit = (productId) => {
    navigate(`/edit-product/${productId}`)
  }

  const handleCloseAlert = () => {
    setShowAlert(false)
  }

  const handleConfigClose = () => {
    setShowWooConfig(false)
    // Optionnel: retester la connexion après fermeture de la configuration
    testWoo()
  }

  return (
    <div style={{ width: '100%' }}>
      <Box display="flex" alignItems="center" gap={2} my={2}>
        <Box width={'30%'}>
          <CategoryFilter />
        </Box>
        <Box width={'60%'}>
          <ProductSearch />
        </Box>
        <Box width={'10%'}>
          {/* <Button
            variant="contained"
            color="primary"
            onClick={testWoo}
            size="small"
            sx={{ whiteSpace: 'nowrap' }}
          >
            Test WooCommerce
          </Button> */}
        </Box>
      </Box>

      <ProductCatalog
        products={filteredProducts}
        redirectToEdit={redirectToEdit}
      />

      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={wooStatus?.success ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {wooStatus?.message || 'Test de connexion effectué'}
        </Alert>
      </Snackbar>

      <WooCommerceConfig open={showWooConfig} onClose={handleConfigClose} />
    </div>
  )
}

export default CatalogPage
