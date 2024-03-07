import React, { createContext, useState, useContext, useEffect } from 'react'
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../api/productService'
import { useConfig } from './ConfigContext'
import { EventEmitter } from '../utils/eventEmitter'
import { updateProductsBulk } from '../api/productService'

const ProductContextSimplified = createContext()

export const useProductContextSimplified = () =>
  useContext(ProductContextSimplified)

export const ProductProviderSimplified = ({ children }) => {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [handleProductSelect, setHandleProductSelect] = useState('')
  const { baseUrl } = useConfig()
  const [selectedProducts, setSelectedProducts] = useState(new Set())

  useEffect(() => {
    loadProducts()
  }, [])

  // Charger les produits
  const loadProducts = async () => {
    try {
      const fetchedProducts = await getProducts(baseUrl)
      setProducts(fetchedProducts)
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
    }
  }

  // Ajouter un produit
  const addProductToContext = async (productData) => {
    try {
      const newProduct = await addProduct(productData)
      setProducts((currentProducts) => [...currentProducts, newProduct])
      EventEmitter.dispatch('PRODUCT_CRUD_OPERATION')
    } catch (error) {
      console.error('Erreur lors de l’ajout du produit:', error)
    }
  }

  // Mettre à jour un produit
  const updateProductInContext = async (productId, productData) => {
    try {
      await updateProduct(productId, productData)
      loadProducts()
      EventEmitter.dispatch('PRODUCT_CRUD_OPERATION')
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error)
    }
  }

  // Supprimer un produit
  const deleteProductFromContext = async (productId) => {
    try {
      await deleteProduct(productId)
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productId),
      )
      EventEmitter.dispatch('PRODUCT_CRUD_OPERATION')
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error)
    }
  }

  // Connexion SSE pour les mises à jour en temps réel
  useEffect(() => {
    const eventSource = new EventSource(`${baseUrl}/api/events`)

    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if (
        ['product-added', 'product-updated', 'product-deleted'].includes(
          data.type,
        )
      ) {
        loadProducts()
      } else if (data.type === 'products-bulk-updated') {
        loadProducts()
      }
    }

    return () => {
      eventSource.close()
    }
  }, [baseUrl, loadProducts])

  // Fonction pour mettre à jour le stock d'un produit spécifique
  const updateProductStock = async (productId, quantityToSubtract) => {
    try {
      // Récupérer le produit actuel par son ID pour obtenir le stock actuel
      const currentProduct = products.find(
        (product) => product._id === productId,
      )
      if (!currentProduct) {
        throw new Error('Produit non trouvé')
      }

      // Calculer le nouveau stock
      const newStock = Math.max(0, currentProduct.stock - quantityToSubtract) // Assurez-vous que le stock ne devient pas négatif

      // Mettre à jour le produit avec le nouveau stock
      await updateProduct(productId, { ...currentProduct, stock: newStock })

      // Mettre à jour l'état local des produits
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId ? { ...product, stock: newStock } : product,
        ),
      )
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stock du produit:', error)
    }
  }

  const bulkUpdateProductsInContext = async (updates) => {
    try {
      await updateProductsBulk(updates)
      loadProducts()
      EventEmitter.dispatch('PRODUCT_CRUD_OPERATION')
    } catch (error) {
      console.error(
        'Erreur lors de la mise à jour en masse des produits:',
        error,
      )
      throw error
    }
  }

  const contextValue = {
    products,
    setProducts,
    addProductToContext,
    updateProductInContext,
    deleteProductFromContext,
    searchTerm,
    setSearchTerm,
    loadProducts,
    selectedProducts,
    setSelectedProducts,
    handleProductSelect,
    updateProductStock,
    bulkUpdateProductsInContext,
  }

  return (
    <ProductContextSimplified.Provider value={contextValue}>
      {children}
    </ProductContextSimplified.Provider>
  )
}

export default ProductProviderSimplified
