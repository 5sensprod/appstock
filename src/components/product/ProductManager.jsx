import React, { useState, useEffect } from 'react'
import useProducts from '../hooks/useProducts'
import useSearch from '../hooks/useSearch'
import useWebSocketConnection from '../hooks/useWebSocketConnection'
import useGlobalScannedDataHandler from '../hooks/useGlobalScannedDataHandler'
import { getApiBaseUrl } from '../../api/axiosConfig'
import AddProductForm from './AddProductForm'
import ProductTable from './ProductTable'
import { getCategories } from '../../api/categoryService'
import SelectCategory from '../category/SelectCategory'
import NoMatchButton from '../ui/NoMatchButton'
import ProductSearch from './ProductSearch'

const ProductManager = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [categories, setCategories] = useState([])
  const [productAdded, setProductAdded] = useState(false)

  const [baseUrl, setBaseUrl] = useState('')
  const [showAddProductForm, setShowAddProductForm] = useState(false)
  const isGencode = !isNaN(searchTerm) && searchTerm.trim() !== ''

  useEffect(() => {
    const fetchCategories = async () => {
      const retrievedCategories = await getCategories()
      setCategories(retrievedCategories)
    }

    fetchCategories()
  }, [])

  const products = useProducts(productAdded)
  const filteredProducts = useSearch(products, searchTerm, selectedCategoryId)
  const showAddProductButton =
    !showAddProductForm && filteredProducts.length === 0
  const isAndroidWebView = navigator.userAgent.toLowerCase().includes('wv')
  useGlobalScannedDataHandler(setSearchTerm)

  // Utilisation du hook useWebSocketConnection
  useWebSocketConnection(setSearchTerm)

  useEffect(() => {
    getApiBaseUrl().then((url) => {
      setBaseUrl(url.replace('/api', ''))
    })
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setShowAddProductForm(false)
    }
  }, [searchTerm])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleScanClick = () => {
    if (window.Android && isAndroidWebView) {
      window.Android.performScan() // Appeler la méthode de l'app Android
    }
  }

  const handleProductSubmit = () => {
    setProductAdded((prevState) => !prevState) // Inverser l'état pour déclencher le rechargement
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
      <h1>Produits</h1>
      {isAndroidWebView && (
        <button onClick={handleScanClick}>Scanner un code-barres</button>
      )}
      <ProductSearch
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />
      <SelectCategory
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={(e) => setSelectedCategoryId(e.target.value)}
      />
      {filteredProducts.length > 0 ? (
        <ProductTable products={filteredProducts} baseUrl={baseUrl} />
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
    </div>
  )
}

export default ProductManager
