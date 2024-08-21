import { useState, useEffect, useRef } from 'react'
import {
  calculatePriceWithMargin,
  calculateMarginFromPrice,
} from '../../../utils/calculations'

export const useProductFormLogic = (initialProduct) => {
  const [product, setProduct] = useState(initialProduct)
  const [marge, setMarge] = useState(parseFloat(initialProduct.marge) || 0)
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(true)
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      setProduct(initialProduct)
    }
  }, [initialProduct])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }))
  }

  const handleMargeChange = (e) => {
    let value = e.target.value.replace(',', '.')
    const numericValue = parseFloat(value) || 0
    setMarge(numericValue)

    if (isCalculatingPrice) {
      const prixAchat = parseFloat(product.prixAchat) || 0
      const tvaRate = parseFloat(product.tva) || 0

      if (prixAchat > 0) {
        const prixVenteArrondi = calculatePriceWithMargin(
          prixAchat,
          numericValue,
          tvaRate,
        )
        setProduct((prevProduct) => ({
          ...prevProduct,
          prixVente: prixVenteArrondi?.toFixed(2) || '',
        }))
      }
    }
  }

  const handlePrixVenteChange = (e) => {
    const value = parseFloat(e.target.value) || 0
    setProduct((prevProduct) => ({
      ...prevProduct,
      prixVente: value,
    }))

    if (!isCalculatingPrice) {
      const prixAchat = parseFloat(product.prixAchat) || 0
      const tvaRate = parseFloat(product.tva) || 0

      if (prixAchat > 0 && value > 0) {
        const calculatedMarge = calculateMarginFromPrice(
          prixAchat,
          value,
          tvaRate,
        )
        setMarge(calculatedMarge.toFixed(2))
      }
    }
  }

  const handlePrixAchatChange = (e) => {
    handleInputChange(e)
    const prixAchat = parseFloat(e.target.value) || 0
    const tvaRate = parseFloat(product.tva) || 0

    if (prixAchat > 0) {
      if (isCalculatingPrice) {
        const prixVenteArrondi = calculatePriceWithMargin(
          prixAchat,
          marge,
          tvaRate,
        )
        setProduct((prevProduct) => ({
          ...prevProduct,
          prixVente: prixVenteArrondi?.toFixed(2) || '',
        }))
      } else {
        const prixVente = parseFloat(product.prixVente) || 0
        if (prixVente > 0) {
          const calculatedMarge = calculateMarginFromPrice(
            prixAchat,
            prixVente,
            tvaRate,
          )
          setMarge(calculatedMarge.toFixed(2))
        }
      }
    }
  }

  const handleTVAChange = (e) => {
    const tvaRate = parseFloat(e.target.value) || 0
    handleInputChange(e)

    if (isCalculatingPrice) {
      const prixAchat = parseFloat(product.prixAchat) || 0
      if (prixAchat > 0) {
        const prixVenteArrondi = calculatePriceWithMargin(
          prixAchat,
          marge,
          tvaRate,
        )
        setProduct((prevProduct) => ({
          ...prevProduct,
          prixVente: prixVenteArrondi?.toFixed(2) || '',
        }))
      }
    } else {
      const prixVente = parseFloat(product.prixVente) || 0
      const prixAchat = parseFloat(product.prixAchat) || 0

      if (prixAchat > 0 && prixVente > 0) {
        const calculatedMarge = calculateMarginFromPrice(
          prixAchat,
          prixVente,
          tvaRate,
        )
        setMarge(calculatedMarge.toFixed(2))
      }
    }
  }

  const handleCategoryChange = (categoryId) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      categorie: categoryId,
    }))
  }

  const toggleCalculationMode = () => {
    setIsCalculatingPrice((prev) => !prev)
  }

  return {
    product,
    marge,
    isCalculatingPrice,
    handleInputChange,
    handleMargeChange,
    handlePrixVenteChange,
    handlePrixAchatChange,
    handleTVAChange,
    handleCategoryChange,
    toggleCalculationMode,
  }
}
