import React, { createContext, useState, useContext, useEffect } from 'react'
import {
  getProducts,
  addProduct,
  updateProduct,
  updateProductsBulk,
  getProductCountByCategory,
} from '../api/productService'
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from '../api/categoryService'
import { useConfig } from './ConfigContext'

const ProductContext = createContext()

export const useProductContext = () => useContext(ProductContext)

const fetchProductCountByCategory = async (baseUrl) => {
  try {
    // Remplacez ceci par votre logique de récupération des données
    const data = await getProductCountByCategory(baseUrl)
    return data
  } catch (error) {
    console.error(
      'Erreur lors de la récupération du comptage des produits par catégorie:',
      error,
    )
    return {}
  }
}

export const ProductProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('')
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const { baseUrl } = useConfig()
  const [selectedProducts, setSelectedProducts] = useState(new Set())
  const [productCountByCategory, setProductCountByCategory] = useState({})

  // Gestion des produits et des SSE
  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        // Chargement des produits et des catégories
        const fetchedProducts = await getProducts(baseUrl)
        const retrievedCategories = await getCategories()
        const productCountData = await fetchProductCountByCategory()

        // Mise à jour des états avec les données chargées
        setProducts(fetchedProducts)
        setCategories(retrievedCategories)
        setProductCountByCategory(productCountData)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      }
    }

    fetchProductsAndCategories()

    // Configuration de la connexion SSE
    const sseConnectionDelay = 5000 // Retarder de 5000 ms (5 secondes)
    const sseTimeout = setTimeout(() => {
      const eventSource = new EventSource(`${baseUrl}/api/events`)

      eventSource.onmessage = (e) => {
        const data = JSON.parse(e.data)

        // Gestion des événements pour les produits et catégories
        if (
          [
            'product-added',
            'product-updated',
            'products-bulk-updated',
            'product-deleted',
          ].includes(data.type)
        ) {
          fetchProductsAndCategories()
        }

        // Gestion de l'événement pour le comptage des produits par catégorie
        if (data.type === 'countByCategory-updated') {
          setProductCountByCategory(data.countByCategory)
        }
        // Ajout de la gestion pour l'événement 'featured-image-updated'
        if (data.type === 'featured-image-updated') {
          setProducts((currentProducts) =>
            currentProducts.map((product) =>
              product._id === data.productId
                ? { ...product, featuredImage: data.featuredImage }
                : product,
            ),
          )
        }
        if (data.type === 'photo-added') {
          setProducts((currentProducts) =>
            currentProducts.map((product) => {
              if (product._id === data.productId) {
                // Si product.photos est null ou undefined, utilisez un tableau vide
                const updatedPhotos = product.photos
                  ? [...product.photos, data.photo]
                  : [data.photo]

                return { ...product, photos: updatedPhotos }
              } else {
                return product
              }
            }),
          )
        }
      }

      return () => {
        eventSource.close()
      }
    }, sseConnectionDelay)

    // Nettoyage de la temporisation et de la connexion SSE
    return () => {
      clearTimeout(sseTimeout)
    }
  }, [baseUrl])

  const getCategoryPath = (categoryId) => {
    // Vérifie si categoryId est une chaîne vide ou null
    if (!categoryId) {
      return 'Non catégorisé'
    }

    let path = []
    let currentCategory = categories.find((cat) => cat._id === categoryId)

    while (currentCategory) {
      path.unshift(currentCategory.name)
      currentCategory = categories.find(
        (cat) => cat._id === currentCategory.parentId,
      )
    }

    return path.length > 0 ? path.join(' > ') : 'Non catégorisé'
  }

  const getParentCategoryName = (categoryId) => {
    let currentCategory = categories.find((cat) => cat._id === categoryId)

    while (currentCategory && currentCategory.parentId) {
      currentCategory = categories.find(
        (cat) => cat._id === currentCategory.parentId,
      )
    }

    return currentCategory ? currentCategory.name : 'Non catégorisé'
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

  const deleteCategoryAndUpdateProducts = async (categoryId) => {
    try {
      // Supprimer la catégorie (et ses sous-catégories côté serveur)
      await deleteCategory(categoryId)

      // Récupérer les listes mises à jour des produits et des catégories
      const updatedProducts = await getProducts(baseUrl)
      const retrievedCategories = await getCategories()

      // Mettre à jour l'état des produits et des catégories
      setProducts(updatedProducts)
      setCategories(retrievedCategories)
    } catch (error) {
      console.error(
        'Erreur lors de la suppression de la catégorie et de la mise à jour des produits',
        error,
      )
      // Gérer l'erreur
    }
  }

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
      // Vérifiez que les valeurs numériques sont des nombres valides
      const numericFields = ['prixVente', 'prixAchat', 'stock', 'tva']
      for (let field of numericFields) {
        if (field in productData && isNaN(productData[field])) {
          throw new Error(`La valeur pour ${field} doit être un nombre valide`)
        }
      }

      const updatedProduct = await updateProduct(productId, productData)
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? updatedProduct : product,
        ),
      )
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error)
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
    addCategory: addCategoryToContext,
    updateCategoryInContext,
    deleteCategoryFromContext,
    deleteCategoryAndUpdateProducts,
    fetchProductCountByCategory,
    productCountByCategory,
    searchTerm,
    setSearchTerm,
    selectedCategoryId,
    setSelectedCategoryId,
    handleCategoryChange,
    categories,
    setCategories,
    products,
    selectedProducts,
    setSelectedProducts,
    setProducts,
    addProduct: addProductToContext,
    updateProductInContext,
    updateProductsBulkInContext,
    selectedSubCategoryId,
    setSelectedSubCategoryId,
    handleSubCategoryChange,
    getCategoryPath,
    getParentCategoryName,
  }

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  )
}

export default ProductProvider
