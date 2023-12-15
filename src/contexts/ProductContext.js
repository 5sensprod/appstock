import React, { createContext, useState, useContext, useEffect } from 'react'
import { getApiBaseUrl } from '../api/axiosConfig'
import {
  getProducts,
  addProduct,
  updateProduct,
  updateProductsBulk,
} from '../api/productService'
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from '../api/categoryService'
const ProductContext = createContext()

export const useProductContext = () => useContext(ProductContext)

export const ProductProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('')
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [baseUrl, setBaseUrl] = useState('')
  const [selectedProducts, setSelectedProducts] = useState(new Set())

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

    const fetchCategories = async () => {
      try {
        const retrievedCategories = await getCategories()
        setCategories(retrievedCategories)
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error)
      }
    }

    // Charge initialement les produits et les catégories
    fetchProducts()
    fetchCategories()

    const eventSource = new EventSource(`${baseUrl}/api/events`)
    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data)

      // Gestion des événements pour les produits
      if (
        data.type === 'product-added' ||
        data.type === 'product-updated' ||
        data.type === 'products-bulk-updated' ||
        data.type === 'product-deleted'
      ) {
        fetchProducts()
      }

      // Gestion des événements pour les catégories
      if (
        data.type === 'category-added' ||
        data.type === 'category-updated' ||
        data.type === 'category-deleted'
      ) {
        fetchCategories()
      }
    }

    return () => {
      eventSource.close()
    }
  }, [baseUrl])

  const addProductToContext = async (productData) => {
    try {
      // Formatage des données avant de les envoyer à l'API
      const formattedData = {
        ...productData,
        prixVente: productData.prixVente
          ? parseFloat(productData.prixVente)
          : 0,
        dateSoumission: new Date().toISOString(),
      }

      const response = await addProduct(formattedData)
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

  const handleCategoryChange = (event) => {
    setSelectedCategoryId(event.target.value)
  }

  const handleSubCategoryChange = (event) => {
    setSelectedSubCategoryId(event.target.value)
  }

  const addCategoryToContext = async (categoryData) => {
    try {
      const response = await addCategory(categoryData)
      setCategories((prevCategories) => [...prevCategories, response])
      return response
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie:", error)
      throw error
    }
  }

  const updateCategoryInContext = async (id, categoryData) => {
    try {
      const updatedCategory = await updateCategory(id, categoryData)
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === id ? updatedCategory : category,
        ),
      )
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie', error)
      throw error
    }
  }

  const deleteCategoryFromContext = async (id) => {
    try {
      await deleteCategory(id)
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category._id !== id),
      )
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie', error)
      throw error
    }
  }

  const contextValue = {
    searchTerm,
    setSearchTerm,
    selectedCategoryId,
    setSelectedCategoryId,
    handleCategoryChange,
    categories,
    setCategories,
    products,
    baseUrl,
    selectedProducts,
    setSelectedProducts,
    setProducts,
    addProduct: addProductToContext,
    updateProductInContext,
    updateProductsBulkInContext,
    selectedSubCategoryId,
    setSelectedSubCategoryId,
    handleSubCategoryChange,
    addCategory: addCategoryToContext,
    updateCategoryInContext,
    deleteCategoryFromContext,
  }

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  )
}

export default ProductProvider
