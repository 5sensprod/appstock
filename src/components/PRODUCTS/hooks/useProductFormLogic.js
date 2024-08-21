import { useState, useEffect, useRef } from 'react'
import {
  calculatePriceWithMargin,
  calculateMarginFromPrice,
} from '../../../utils/calculations'

export const useProductFormLogic = (initialProduct) => {
  // Initialisation de marge avec une chaîne vide si initialProduct.marge est vide ou 0
  const [marge, setMarge] = useState(
    initialProduct.marge !== undefined && initialProduct.marge !== 0
      ? parseFloat(initialProduct.marge).toString().replace('.', ',')
      : '',
  )

  const [product, setProduct] = useState({
    ...initialProduct,
    prixVente: initialProduct.prixVente !== 0 ? initialProduct.prixVente : '',
  })

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
    const numericValue = parseFloat(value) || ''
    setMarge(value) // Garde la valeur brute de marge

    if (isCalculatingPrice && numericValue) {
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
    const value = parseFloat(e.target.value) || ''
    setProduct((prevProduct) => ({
      ...prevProduct,
      prixVente: value,
    }))

    if (!isCalculatingPrice && value) {
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
      if (isCalculatingPrice && marge !== '') {
        const prixVenteArrondi = calculatePriceWithMargin(
          prixAchat,
          parseFloat(marge.replace(',', '.')),
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

    if (isCalculatingPrice && marge !== '') {
      const prixAchat = parseFloat(product.prixAchat) || 0
      if (prixAchat > 0) {
        const prixVenteArrondi = calculatePriceWithMargin(
          prixAchat,
          parseFloat(marge.replace(',', '.')),
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
