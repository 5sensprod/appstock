import { useEffect, useContext } from 'react'
import { CartContext } from '../contexts/CartContext'
import { useProductContext } from '../contexts/ProductContext'

export const useBarcodeScan = () => {
  const { products } = useProductContext()
  const { addToCart, updateQuantity, cartItems } = useContext(CartContext)
  useEffect(() => {
    let barcodeBuffer = ''
    console.log('Products available:', products)

    const handleScan = (event) => {
      console.log('Scan Event:', event.key)
      console.log('Current Buffer:', barcodeBuffer)

      if (event.key === 'Enter' && barcodeBuffer) {
        console.log('Scanned Barcode:', barcodeBuffer)
        const product = products.find((p) => p.gencode === barcodeBuffer)
        console.log('Found Product:', product)

        if (product) {
          const existingItem = cartItems.find(
            (item) => item._id === product._id,
          )

          if (existingItem) {
            updateQuantity(existingItem._id, existingItem.quantity + 1)
          } else {
            // Ajouter au panier avec CartContext
            addToCart({
              ...product,
              quantity: 1,
            })
          }
        }

        barcodeBuffer = ''
      } else if (event.key.length === 1) {
        barcodeBuffer += event.key
      }
    }

    window.addEventListener('keydown', handleScan)
    return () => window.removeEventListener('keydown', handleScan)
  }, [products, cartItems, updateQuantity])
}
