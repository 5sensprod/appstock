// src/components/product/ProductSearch.jsx
import React, { useState, useEffect } from 'react'
import useProducts from '../hooks/useProducts'
import useSearch from '../hooks/useSearch'
import useWebSocketConnection from './hooks/useWebSocketConnection'
import useGlobalScannedDataHandler from '../hooks/useGlobalScannedDataHandler'
import { getApiBaseUrl } from '../../api/axiosConfig'
import AddProductForm from './AddProductForm'
import ProductTable from './ProductTable'

const ProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [productAdded, setProductAdded] = useState(false)
  const products = useProducts(productAdded)
  const filteredProducts = useSearch(products, searchTerm)
  const [baseUrl, setBaseUrl] = useState('')
  const [showAddProductForm, setShowAddProductForm] = useState(false)
  const isGencode = !isNaN(searchTerm) && searchTerm.trim() !== ''

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
    setSearchTerm('') // Réinitialiser le champ de recherche
  }

  return (
    <div>
      <h1>Produits</h1>
      {isAndroidWebView && (
        <button onClick={handleScanClick}>Scanner un code-barres</button>
      )}
      <input
        id="search-input"
        placeholder="Rechercher un produit"
        type="search"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {filteredProducts.length > 0 ? (
        <ProductTable products={filteredProducts} baseUrl={baseUrl} />
      ) : (
        <div>
          <p>Aucun produit trouvé.</p>
          {!showAddProductForm && (
            <button onClick={handleShowAddForm}>Ajouter</button>
          )}
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

export default ProductSearch
