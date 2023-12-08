import React, { createContext, useState, useContext, useEffect } from 'react'
import { getApiBaseUrl } from '../api/axiosConfig'
import { getProducts } from '../api/productService'

const ProductContext = createContext()

export const useProductContext = () => useContext(ProductContext)

export const ProductProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([]) // Ajout d'un état pour les produits
  const [baseUrl, setBaseUrl] = useState('')
  const [isBulkEditActive, setIsBulkEditActive] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState(new Set())
  const [fieldsToEdit, setFieldsToEdit] = useState({})

  useEffect(() => {
    getApiBaseUrl().then((url) => {
      setBaseUrl(url.replace('/api', ''))
    })
  }, [])

  // Gestion des produits et des SSE
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts(baseUrl)
        setProducts(fetchedProducts)
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error)
      }
    }

    fetchProducts()

    // Établir la connexion SSE
    const eventSource = new EventSource(`${baseUrl}/api/events`)
    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if (data.type === 'product-added' || data.type === 'product-updated') {
        fetchProducts() // Recharger la liste des produits
      }
    }

    return () => {
      eventSource.close()
    }
  }, [baseUrl]) // Dépend de baseUrl

  // Fonction pour activer/désactiver la modification en masse
  const toggleBulkEdit = () => {
    setIsBulkEditActive((prevState) => !prevState)
    if (!isBulkEditActive) {
      setSelectedProducts(new Set()) // Réinitialiser la sélection quand on quitte le mode modification en masse
    }
  }

  // Fonction pour gérer la sélection des produits
  const handleProductSelect = (productId) => {
    setSelectedProducts((prevSelected) => {
      const newSelected = new Set(prevSelected)
      if (newSelected.has(productId)) {
        newSelected.delete(productId)
      } else {
        newSelected.add(productId)
      }
      return newSelected
    })
  }

  // Fonction pour gérer la sélection des champs à modifier
  const handleFieldSelect = (fieldName) => {
    setFieldsToEdit((prevFields) => ({
      ...prevFields,
      [fieldName]: !prevFields[fieldName],
    }))
  }

  const contextValue = {
    searchTerm,
    setSearchTerm,
    selectedCategoryId,
    setSelectedCategoryId,
    categories,
    setCategories,
    products,
    baseUrl,
    isBulkEditActive,
    setIsBulkEditActive,
    toggleBulkEdit,
    selectedProducts,
    handleProductSelect,
    fieldsToEdit,
    handleFieldSelect,
  }

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  )
}

export default ProductProvider
