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
import { Box, Button } from '@mui/material'

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

  const filteredProducts = useSearch(products, searchTerm, selectedCategoryId)

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
    <div>
      <Box />
      <h1>Produits</h1>
      {isAndroidWebView && (
        <Button variant="contained" onClick={handleScanClick}>
          Scanner un code-barres
        </Button>
      )}

      {!showAddProductForm && (
        <>
          <Box my={2}>
            <ProductSearch />
          </Box>
          <SelectCategory
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={(e) => setSelectedCategoryId(e.target.value)}
          />
        </>
      )}

      {filteredProducts.length > 0 ? (
        <ProductTable
          products={filteredProducts}
          onProductSelect={handleProductSelect}
          selectedProducts={selectedProducts}
        />
      ) : (
        <div>
          {showAddProductForm ? (
            <p>Ajouter un nouveau produit</p>
          ) : (
            <p>Aucun produit trouvé.</p>
          )}
          <NoMatchButton
            show={!showAddProductForm && showAddProductButton}
            buttonText="Ajouter"
            onClick={handleShowAddForm}
          />
        </div>
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
    </div>
  )
}

export default ProductManager
