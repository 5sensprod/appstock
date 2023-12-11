import React, { createContext, useState, useContext, useEffect } from 'react'
import { getApiBaseUrl } from '../api/axiosConfig'
import { getProducts } from '../api/productService'
import { getCategories } from '../api/categoryService'

const ProductContext = createContext()

export const useProductContext = () => useContext(ProductContext)

export const ProductProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [baseUrl, setBaseUrl] = useState('')
  const [isBulkEditActive, setIsBulkEditActive] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState(new Set())
  const [fieldsToEdit, setFieldsToEdit] = useState({})
  const [showBulkEditForm, setShowBulkEditForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [shouldStartSSE, setShouldStartSSE] = useState(false)

  useEffect(() => {
    getApiBaseUrl().then((url) => {
      setBaseUrl(url.replace('/api', ''))
    })
  }, [])

  // Gestion des produits et des SSE
  useEffect(() => {
    // Récupération des produits
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts(baseUrl)
        setProducts(fetchedProducts)
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error)
      }
    }

    fetchProducts()

    // Démarrer la connexion SSE après un délai
    setTimeout(() => setShouldStartSSE(true), 5000) // 5 secondes

    return () => {
      // Nettoyage si nécessaire
    }
  }, [baseUrl])

  useEffect(() => {
    if (shouldStartSSE) {
      // Logique pour démarrer la connexion SSE
      const eventSource = new EventSource(`${baseUrl}/api/events`)
      eventSource.onmessage = (e) => {
        const data = JSON.parse(e.data)
        if (
          data.type === 'product-added' ||
          data.type === 'product-updated' ||
          data.type === 'products-bulk-updated'
        ) {
          // Re-fetch products or other logic
        }
      }

      // Nettoyage : fermer la connexion SSE
      return () => {
        if (eventSource) {
          eventSource.close()
        }
      }
    }
  }, [shouldStartSSE, baseUrl])

  useEffect(() => {
    const fetchCategories = async () => {
      const retrievedCategories = await getCategories()
      setCategories(retrievedCategories)
    }

    fetchCategories()
  }, [])

  // Fonction pour activer/désactiver la modification en masse
  const toggleBulkEdit = () => {
    setIsBulkEditActive((prevState) => !prevState)
    if (!isBulkEditActive) {
      setSelectedProducts(new Set())
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

  const cancelEdit = () => {
    setEditingProduct(null)
  }

  const cancelBulkEdit = () => {
    setShowBulkEditForm(false)
    setIsBulkEditActive(false)
    setSelectedProducts(new Set())
    setFieldsToEdit({})
    // Autres actions nécessaires pour annuler l'édition en masse
  }

  const contextValue = {
    searchTerm,
    setSearchTerm,
    editingProduct,
    setEditingProduct,
    cancelEdit,
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
    setFieldsToEdit,
    selectedProducts,
    setSelectedProducts,
    showBulkEditForm,
    setShowBulkEditForm,
    cancelBulkEdit,
  }

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  )
}

export default ProductProvider
