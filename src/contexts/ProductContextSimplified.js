import React, { createContext, useState, useContext, useEffect } from 'react'
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../api/productService'
import { useConfig } from './ConfigContext'

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
      const newProduct = await addProduct(baseUrl, productData)
      // Ici, vous pourriez soit rappeler loadProducts(), soit mettre à jour l'état directement
      // si newProduct contient l'ID généré par NeDB.
      loadProducts()
    } catch (error) {
      console.error('Erreur lors de l’ajout du produit:', error)
    }
  }

  // Mettre à jour un produit
  const updateProductInContext = async (productId, productData) => {
    try {
      await updateProduct(productId, productData)
      loadProducts()
      // Déclencher l'événement personnalisé
      document.dispatchEvent(new CustomEvent('productUpdated'))
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error)
    }
  }

  // Supprimer un produit
  const deleteProductFromContext = async (productId) => {
    try {
      await deleteProduct(productId)
      loadProducts()

      // Créer et émettre un événement personnalisé
      const event = new CustomEvent('product-deleted', {
        detail: { productId },
      })
      document.dispatchEvent(event)
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error)
    }
  }
  const handleProductDeleted = (e) => {
    const deletedProductId = e.detail.productId
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product._id !== deletedProductId),
    )
  }

  useEffect(() => {
    document.addEventListener('product-deleted', handleProductDeleted)
    return () =>
      document.removeEventListener('product-deleted', handleProductDeleted)
  }, [])

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
    addProduct,
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
