import React, { createContext, useState, useContext, useEffect } from 'react'
import { getApiBaseUrl } from '../api/axiosConfig'
import {
  getProducts,
  addProduct,
  updateProduct,
  updateProductsBulk,
} from '../api/productService'
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

    let eventSource
    const setupSSE = () => {
      eventSource = new EventSource(`${baseUrl}/api/events`)
      eventSource.onmessage = (e) => {
        const data = JSON.parse(e.data)
        if (
          data.type === 'product-added' ||
          data.type === 'product-updated' ||
          data.type === 'products-bulk-updated' ||
          data.type === 'product-deleted'
        ) {
          fetchProducts()
        }
      }
    }

    const sseTimeout = setTimeout(setupSSE, 5000)
    return () => {
      if (eventSource) {
        eventSource.close()
      }
      clearTimeout(sseTimeout)
    }
  }, [baseUrl])

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

  const addProductToContext = async (productData) => {
    try {
      // Formatage des données avant de les envoyer à l'API
      const formattedData = {
        ...productData,
        prixVente: productData.prixVente
          ? parseFloat(productData.prixVente)
          : 0,
        dateSoumission: new Date().toISOString(), // Ajoutez la date de soumission actuelle
      }

      const response = await addProduct(formattedData) // Utilisation des données formatées
      // Mettez à jour l'état du contexte si nécessaire, par exemple ajouter le produit à une liste
      return response
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit:", error)
      throw error
    }
  }

  const updateProductInContext = async (productId, productData) => {
    try {
      const updatedProduct = await updateProduct(productId, productData)
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? updatedProduct : product,
        ),
      )
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit', error)
      throw error
    }
  }

  const updateProductsBulkInContext = async (updates) => {
    try {
      await updateProductsBulk(updates)
      // Mettre à jour l'état des produits ici
    } catch (error) {
      console.error('Erreur lors de la mise à jour en masse', error)
      throw error
    }
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
    setProducts,
    addProduct: addProductToContext,
    updateProductInContext,
    updateProductsBulkInContext,
  }

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  )
}

export default ProductProvider
