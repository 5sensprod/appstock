import { useState, useEffect } from 'react'
import { getProducts } from '../../api/productService'
import { getLocalIp } from '../../ipcHelper'

const useProducts = (productAdded) => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const localIp = await getLocalIp()
        const fetchedProducts = await getProducts(localIp)
        setProducts(fetchedProducts)
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error)
      }
    }

    fetchProducts()
  }, [productAdded])

  return products
}

export default useProducts
