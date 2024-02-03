import React, { useEffect, useState } from 'react'
import useSearch from '../hooks/useSearch'
import useWebSocketConnection from '../hooks/useWebSocketConnection'
import useGlobalScannedDataHandler from '../hooks/useGlobalScannedDataHandler'
import CreateProductShort from './CreateProductShort'
import ProductTable from './ProductTable'
import SelectCategory from '../category/SelectCategory'
import NoMatchButton from '../ui/NoMatchButton'
import ProductSearch from './ProductSearch'
import { useProductContext } from '../../contexts/ProductContext'
import { useCategoryContext } from '../../contexts/CategoryContext'
import { Box, Button, Typography } from '@mui/material'

const ProductManager = () => {
  const {
    searchTerm,
    selectedCategoryId,
    // categories,
    setSelectedCategoryId,
    setSearchTerm,
    products,
    selectedProducts,
    handleProductSelect,
  } = useProductContext()

  const { categories } = useCategoryContext()

  const [showAddProductForm, setShowAddProductForm] = useState(false)
  const isGencode = !isNaN(searchTerm) && searchTerm.trim() !== ''

  const filteredProducts = useSearch(
    products,
    searchTerm,
    selectedCategoryId,
    categories,
  )

  const isSearchingByReferenceOnly =
    searchTerm.trim() !== '' && selectedCategoryId === ''

  const showAddProductButton =
    !showAddProductForm &&
    filteredProducts.length === 0 &&
    isSearchingByReferenceOnly

  const isAndroidWebView = navigator.userAgent.toLowerCase().includes('wv')

  useGlobalScannedDataHandler(setSearchTerm)

  useWebSocketConnection(setSearchTerm)

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setShowAddProductForm(false)
    }
  }, [searchTerm])

  const handleScanClick = () => {
    if (window.Android && isAndroidWebView) {
      window.Android.performScan()
    }
  }

  const handleProductSubmit = () => {
    setShowAddProductForm(false)
    setSearchTerm('')
  }

  const handleShowAddForm = () => {
    setShowAddProductForm(true)
  }

  const handleCancel = () => {
    setShowAddProductForm(false)
    setSearchTerm('')
  }

  return (
    <>
      <Box />
      {isAndroidWebView && (
        <Button variant="contained" onClick={handleScanClick}>
          Scanner un code-barres
        </Button>
      )}

      {!showAddProductForm && (
        <>
          <Box mb={2}>
            <ProductSearch />
          </Box>
          <Box mb={2}>
            <SelectCategory
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={(e) => setSelectedCategoryId(e.target.value)}
            />
          </Box>
        </>
      )}

      {filteredProducts.length > 0 ? (
        <ProductTable
          products={filteredProducts}
          onProductSelect={handleProductSelect}
          selectedProducts={selectedProducts}
        />
      ) : (
        <>
          {showAddProductForm ? (
            <p>Ajouter un nouveau produit</p>
          ) : (
            <Typography variant="h6">Aucun produit trouvé</Typography>
          )}
          <NoMatchButton
            show={!showAddProductForm && showAddProductButton}
            buttonText="Ajouter"
            onClick={handleShowAddForm}
          />
        </>
      )}
      {showAddProductForm && (
        <CreateProductShort
          initialGencode={isGencode ? searchTerm : ''}
          initialReference={!isGencode ? searchTerm : ''}
          onProductAdd={handleProductSubmit}
          onCancel={handleCancel}
        />
      )}
      <Box />
    </>
  )
}

export default ProductManager
