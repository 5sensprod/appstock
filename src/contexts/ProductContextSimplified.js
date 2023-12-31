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
      loadProducts()
      EventEmitter.dispatch('PRODUCT_CRUD_OPERATION')
    } catch (error) {
      console.error('Erreur lors de l’ajout du produit:', error)
    }
  }

  // Mettre à jour un produit
  const updateProductInContext = async (productId, productData) => {
    try {
      await updateProduct(productId, productData) // Mise à jour du produit via l'API
      loadProducts() // Rechargement de la liste des produits
      EventEmitter.dispatch('PRODUCT_CRUD_OPERATION') // Déclencher un événement pour notifier les autres parties de l'application
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error) // Gestion des erreurs
    }
  }

  // Supprimer un produit
  const deleteProductFromContext = async (productId) => {
    try {
      await deleteProduct(productId) // Suppression du produit via l'API
      loadProducts() // Rechargement de la liste des produits
      EventEmitter.dispatch('PRODUCT_CRUD_OPERATION') // Déclencher un événement pour notifier les autres parties de l'application
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error) // Gestion des erreurs
    }
  }

  // Connexion SSE pour les mises à jour en temps réel
  useEffect(() => {
    const eventSource = new EventSource(`${baseUrl}/api/events`)

    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data)

      // Gérer les mises à jour pour les produits
      if (
        ['product-added', 'product-updated', 'product-deleted'].includes(
          data.type,
        )
      ) {
        loadProducts()
      }
    }

    // Nettoyage à la désinscription
    return () => {
      eventSource.close()
    }
  }, [baseUrl])

  const contextValue = {
    products,
    addProduct: addProductToContext,
    updateProductInContext,
    deleteProduct: deleteProductFromContext,
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
