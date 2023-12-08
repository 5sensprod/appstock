import React, { useEffect, useState } from 'react'
import useSearch from '../hooks/useSearch'
import useWebSocketConnection from '../hooks/useWebSocketConnection'
import useGlobalScannedDataHandler from '../hooks/useGlobalScannedDataHandler'
import AddProductForm from './AddProductForm'
import ProductTable from './ProductTable'
import { updateProduct } from '../../api/productService'
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
  } = useProductContext()
  const [showAddProductForm, setShowAddProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
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

  return (
    <div>
      <h1>Produits</h1>
      {isAndroidWebView && (
        <button onClick={handleScanClick}>Scanner un code-barres</button>
      )}
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
        />
      ) : (
        <>
          {filteredProducts.length > 0 ? (
            <ProductTable products={filteredProducts} onEdit={handleEdit} />
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
