import React, { useEffect, useState } from 'react'
import useSearch from '../hooks/useSearch'
import useWebSocketConnection from '../hooks/useWebSocketConnection'
import useGlobalScannedDataHandler from '../hooks/useGlobalScannedDataHandler'
import AddProductForm from './AddProductForm'
import BulkEditForm from './BulkEditForm'
import ProductTable from './ProductTable'
import { updateProduct, updateProductsBulk } from '../../api/productService'
import EditProductForm from './EditProductForm'
import { getCategories } from '../../api/categoryService'
import SelectCategory from '../category/SelectCategory'
import NoMatchButton from '../ui/NoMatchButton'
import ProductSearch from './ProductSearch'
import { useProductContext } from '../../contexts/ProductContext'

const ProductManager = () => {
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

  const showAddProductButton =
    !showAddProductForm && filteredProducts.length === 0
  const isAndroidWebView = navigator.userAgent.toLowerCase().includes('wv')
  useGlobalScannedDataHandler(setSearchTerm)

  // Utilisation du hook useWebSocketConnection
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
    setProductAdded((prevState) => !prevState)
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
    await updateProduct(productId, productData)
    setEditingProduct(null)
  }

  const handleBulkEditSubmit = async (formValues) => {
    // Préparez les données pour la mise à jour en masse
    const updates = Array.from(selectedProducts).map((productId) => ({
      id: productId,
      changes: formValues,
    }))

    try {
      const response = await updateProductsBulk(updates)

      // Si la mise à jour réussit, réinitialisez l'état
      setShowBulkEditForm(false)
      setIsBulkEditActive(false)
      setSelectedProducts(new Set())
      setFieldsToEdit({})

      // Ici un message de succès ou d'autres actions nécessaires après la mise à jour réussie
    } catch (error) {
      // Gérez les erreurs ici
      console.error(
        'Erreur lors de la mise à jour en masse des produits',
        error,
      )
      // Gérer l'affichage d'un message d'erreur ou d'autres actions en cas d'échec
    }
  }

  return (
    <div>
      <h1>Produits</h1>
      {isAndroidWebView && (
        <button onClick={handleScanClick}>Scanner un code-barres</button>
      )}
      <button onClick={() => setIsBulkEditActive(!isBulkEditActive)}>
        {isBulkEditActive
          ? 'Désactiver la Sélection Multiple'
          : 'Activer la Sélection Multiple'}
      </button>

      {isBulkEditActive && selectedProducts.size >= 2 && (
        <button onClick={() => setShowBulkEditForm(true)}>
          Modification Multiples
        </button>
      )}

      {showBulkEditForm && <BulkEditForm onSubmit={handleBulkEditSubmit} />}
      <ProductSearch />
      <SelectCategory
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={(e) => setSelectedCategoryId(e.target.value)}
      />
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
            <ProductTable
              products={filteredProducts}
              onEdit={handleEdit}
              onProductSelect={handleProductSelect}
              selectedProducts={selectedProducts}
              isBulkEditActive={isBulkEditActive}
            />
          ) : (
            <div>
              <p>Aucun produit trouvé.</p>
              <NoMatchButton
                show={showAddProductButton}
                buttonText="Ajouter"
                onClick={handleShowAddForm}
              />
              {showAddProductForm && (
                <>
                  <AddProductForm
                    initialGencode={isGencode ? searchTerm : ''}
                    initialReference={!isGencode ? searchTerm : ''}
                    onProductAdd={handleProductSubmit}
                  />
                  <button onClick={handleCancel}>Annuler</button>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ProductManager
