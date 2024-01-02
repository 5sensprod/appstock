import React, { createContext, useState, useContext, useEffect } from 'react'
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../api/productService'
import { useConfig } from './ConfigContext'
import { EventEmitter } from '../utils/eventEmitter'

const ProductContextSimplified = createContext()

export const useProductContextSimplified = () =>
  useContext(ProductContextSimplified)

export const ProductProviderSimplified = ({ children }) => {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const { baseUrl } = useConfig()

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
      }
    }

    return () => {
      eventSource.close()
    }
  }, [baseUrl, loadProducts])

  const contextValue = {
    products,
    setProducts,
    addProductToContext,
    updateProductInContext,
    deleteProductFromContext,
    searchTerm,
    setSearchTerm,
    loadProducts,
  }

  return (
    <ProductContextSimplified.Provider value={contextValue}>
      {children}
    </ProductContextSimplified.Provider>
  )
}

export default ProductProviderSimplified
