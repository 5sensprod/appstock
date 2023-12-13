import React, { useEffect, useState } from 'react'
import useSearch from '../../hooks/useSearch'
import useWebSocketConnection from '../../hooks/useWebSocketConnection'
import useGlobalScannedDataHandler from '../../hooks/useGlobalScannedDataHandler'
import AddProductForm from '../AddProductForm'
import ProductTableMobil from './ProductTableMobil'
import { getCategories } from '../../../api/categoryService'
import NoMatchButton from '../../ui/NoMatchButton'
import { useProductContext } from '../../../contexts/ProductContext'
import { Box, Button } from '@mui/material'

const ProductManagerMobil = () => {
  const {
    searchTerm,
    selectedCategoryId,
    setCategories,
    setSearchTerm,
    products,
  } = useProductContext()
  const [showAddProductForm, setShowAddProductForm] = useState(false)
  const isGencode = !isNaN(searchTerm) && searchTerm.trim() !== ''

  useEffect(() => {
    const fetchCategories = async () => {
      const retrievedCategories = await getCategories()
      setCategories(retrievedCategories)
    }

    fetchCategories()
  }, [])

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

      <>
        {filteredProducts.length > 0 ? (
          <ProductTableMobil products={filteredProducts} />
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
          <>
            <AddProductForm
              initialGencode={isGencode ? searchTerm : ''}
              initialReference={!isGencode ? searchTerm : ''}
              onProductAdd={handleProductSubmit}
            />
            <Button variant="contained" onClick={handleCancel}>
              Annuler
            </Button>
          </>
        )}
      </>

      <Box />
    </div>
  )
}

export default ProductManagerMobil
