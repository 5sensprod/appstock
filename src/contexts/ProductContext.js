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

  const contextValue = {
    searchTerm,
    setSearchTerm,
    selectedCategoryId,
    setSelectedCategoryId,
    categories,
    setCategories,
    products,
    baseUrl,
  }

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  )
}

export default ProductProvider
