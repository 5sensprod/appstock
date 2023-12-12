import React, { useEffect, useState } from 'react'
import useSearch from '../hooks/useSearch'
import useWebSocketConnection from '../hooks/useWebSocketConnection'
import useGlobalScannedDataHandler from '../hooks/useGlobalScannedDataHandler'
import AddProductForm from './AddProductForm'
import BulkEditForm from './BulkEditForm'
import ProductTableMobil from './ProductTableMobil'
import EditProductForm from './EditProductForm'
import { getCategories } from '../../api/categoryService'
import SelectCategory from '../category/SelectCategory'
import NoMatchButton from '../ui/NoMatchButton'
import ProductSearch from './ProductSearch'
import { useProductContext } from '../../contexts/ProductContext'
import { Box, Button } from '@mui/material'

const ProductManagerMobil = () => {
  const {
    searchTerm,
    selectedCategoryId,
    categories,
    setCategories,
    setSelectedCategoryId,
    setSearchTerm,
    products,
    isBulkEditActive,
    setIsBulkEditActive,
    selectedProducts,
    setSelectedProducts,
    handleProductSelect,
    setFieldsToEdit,
    showBulkEditForm,
    setShowBulkEditForm,
    cancelEdit,
    editingProduct,
    setEditingProduct,
    updateProductInContext,
    updateProductsBulkInContext,
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

  const handleEdit = (product) => {
    setEditingProduct(product)
  }

  const handleUpdateProduct = async (productId, productData) => {
    await updateProductInContext(productId, productData) // Assurez-vous que c'est bien cette fonction qui est appelée
    setEditingProduct(null)
  }

  const handleBulkEditSubmit = async (formValues) => {
    const updates = Array.from(selectedProducts).map((productId) => ({
      id: productId,
      changes: formValues,
    }))

    try {
      await updateProductsBulkInContext(updates)

      setShowBulkEditForm(false)
      setIsBulkEditActive(false)
      setSelectedProducts(new Set())
      setFieldsToEdit({})
    } catch (error) {
      console.error(
        'Erreur lors de la mise à jour en masse des produits',
        error,
      )
      // Gérer l'affichage d'un message d'erreur ou d'autres actions en cas d'échec
    }
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

      {!editingProduct && !showAddProductForm && (
        <>
          <ProductSearch />
          {/* <SelectCategory
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={(e) => setSelectedCategoryId(e.target.value)}
          /> */}
        </>
      )}

      {showBulkEditForm && <BulkEditForm onSubmit={handleBulkEditSubmit} />}

      {editingProduct ? (
        <EditProductForm
          product={editingProduct}
          categories={categories}
          onProductUpdate={handleUpdateProduct}
          onCancel={cancelEdit}
        />
      ) : (
        <>
          {filteredProducts.length > 0 ? (
            <ProductTableMobil
              products={filteredProducts}
              onEdit={handleEdit}
              onProductSelect={handleProductSelect}
              selectedProducts={selectedProducts}
              isBulkEditActive={isBulkEditActive}
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
      )}
      <Box />
    </div>
  )
}

export default ProductManagerMobil
