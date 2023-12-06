import { useState, useEffect } from 'react'
import { getProducts } from '../../api/productService'
import { getLocalIp } from '../../ipcHelper'

const useProducts = (productAdded) => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    getLocalIp().then((localIp) => {
      getProducts(localIp)
        .then(setProducts)
        .catch((error) => {
          console.error('Erreur lors de la récupération des produits:', error)
        })
    })
  }, [productAdded])

  return products
}
export default useProducts
