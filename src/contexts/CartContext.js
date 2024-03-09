import React, { createContext, useState, useEffect } from 'react'
import {
  calculateTotal,
  calculateDiscountMarkup,
  calculateTax,
  applyCartDiscountOrMarkup,
} from '../utils/priceUtils'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [cartTotals, setCartTotals] = useState({
    totalHT: 0,
    totalTTC: 0,
    totalTaxes: 0,
    originalTotal: 0,
    modifiedTotal: 0,
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [invoiceData, setInvoiceData] = useState(null)
  const [adjustmentAmount, setAdjustmentAmount] = useState(0)

  const [paymentType, setPaymentType] = useState('CB')
  const [amountPaid, setAmountPaid] = useState('')

  const [multiplePayments, setMultiplePayments] = useState([])
  const [paymentDetails, setPaymentDetails] = useState([])

  const [selectedPaymentType, setSelectedPaymentType] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [editingPayment, setEditingPayment] = useState({
    index: null,
    value: '',
  })

  const calculateRemainingAmount = () => {
    const total =
      adjustmentAmount !== 0
        ? cartTotals.modifiedTotal
        : cartTotals.originalTotal
    const totalPaid = multiplePayments.reduce(
      (acc, payment) => acc + payment.amount,
      0,
    )
    return total - totalPaid
  }

  const calculateChange = (givenAmount = amountPaid) => {
    const paid = givenAmount ? parseFloat(givenAmount) : 0

    const total =
      adjustmentAmount !== 0
        ? cartTotals.modifiedTotal
        : cartTotals.originalTotal
    let change = paid - total
    return isNaN(change) ? 0 : parseFloat(change.toFixed(2))
  }

  const initialCashDetails = {
    givenAmount: 0,
    changeAmount: 0,
  }

  // Définition de l'état pour cashDetails
  const [cashDetails, setCashDetails] = useState(initialCashDetails)

  // Fonction pour réinitialiser cashDetails
  const resetCashDetails = () => {
    setCashDetails(initialCashDetails)
  }

  // Ajoute une fonction pour réinitialiser les paiements
  const resetPaymentInfo = () => {
    setSelectedPaymentType('')
    setPaymentAmount('')
    setMultiplePayments([])
    setPaymentDetails([])
    setPaymentType('CB')
    setAmountPaid('')
    resetCashDetails()
  }

  // Fonction pour mettre à jour l'état d'édition du paiement multiple
  const startEditingPayment = (index, value) => {
    setEditingPayment({ index, value })
  }

  const stopEditingPayment = () => {
    setEditingPayment({ index: null, value: '' })
  }

  const calculateTotalItem = (item) => {
    const total = parseFloat(item.puTTC) * parseInt(item.quantity, 10)
    return isNaN(total) ? 0 : total.toFixed(2)
  }

  const enrichCartItem = (item) => {
    const priceToUse = parseFloat(item.prixModifie ?? item.prixVente)
    const taxRateForItem = parseFloat(item.tva) / 100
    const prixHT = priceToUse / (1 + taxRateForItem)
    const montantTVA = calculateTax(prixHT, taxRateForItem)
    const tauxTVA = item.tva

    // Utilise `priceToUse` comme `puTTC` pour le calcul de `totalItem`
    const totalItem = calculateTotalItem({ ...item, puTTC: priceToUse })

    return {
      ...item,
      prixHT: prixHT.toFixed(2),
      puTTC: priceToUse.toFixed(2),
      montantTVA: montantTVA.toFixed(2),
      tauxTVA,
      remiseMajorationLabel: calculateDiscountMarkup(
        item.prixVente,
        item.prixModifie,
      ).label,
      remiseMajorationValue: calculateDiscountMarkup(
        item.prixVente,
        item.prixModifie,
      ).value,
      totalItem,
    }
  }
  // Calculer les totaux HT, TTC et les taxes pour les articles du panier
  const calculateCartTotals = (items) => {
    const totalHT = calculateTotal(items, (item) => item.prixHT)
    const totalTTC = calculateTotal(
      items,
      (item) => item.prixModifie ?? item.prixVente,
    )
    const totalTaxes = totalTTC - totalHT

    return { totalHT, totalTTC, totalTaxes }
  }

  // Mettre à jour les totaux chaque fois que le panier est modifié
  useEffect(() => {
    const newCartTotals = calculateCartTotals(cartItems)
    setCartTotals((prevTotals) => ({
      ...prevTotals,
      totalHT: newCartTotals.totalHT,
      totalTTC: newCartTotals.totalTTC,
      totalTaxes: newCartTotals.totalTaxes,
      originalTotal: newCartTotals.totalTTC,
    }))

    // Réappliquer la remise ou la majoration déjà définie si adjustmentAmount n'est pas 0
    if (adjustmentAmount !== 0 && cartItems.length > 0) {
      setCartTotals((prevTotals) => {
        const adjustedTotal = applyCartDiscountOrMarkup(
          prevTotals.totalTTC,
          adjustmentAmount,
        )
        return {
          ...prevTotals,
          modifiedTotal: adjustedTotal,
        }
      })
    }

    // Réinitialiser adjustmentAmount si le panier est vide
    if (cartItems.length === 0) {
      setAdjustmentAmount(0)
    }
  }, [cartItems, adjustmentAmount])

  const addToCart = (product) => {
    setCartItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (item) => item._id === product._id,
      )
      if (existingItemIndex > -1) {
        // Le produit existe déjà, mettre à jour la quantité
        const newItems = [...currentItems]
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1, // Assurez-vous que la quantité est mise à jour
        }
        return newItems.map((item) => enrichCartItem(item)) // Re-enrichissement des articles
      } else {
        // Nouvel article, définir la quantité à 1
        return [...currentItems, enrichCartItem({ ...product, quantity: 1 })] // Ajouter l'article avec la quantité initialisée à 1
      }
    })
  }

  // Mettre à jour la quantité d'un produit dans le panier
  const updateQuantity = (productId, newQuantity) => {
    setCartItems((currentItems) => {
      return currentItems.map((item) =>
        item._id === productId
          ? enrichCartItem({ ...item, quantity: newQuantity })
          : item,
      )
    })
  }
  // Mettre à jour le prix d'un article dans le panier
  const updatePrice = (productId, newPrice) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item._id === productId
          ? enrichCartItem({ ...item, prixModifie: newPrice })
          : item,
      ),
    )
  }

  // Retirer un produit du panier
  const removeItem = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item._id !== productId),
    )
  }

  // Vider panier
  const clearCart = () => {
    // Vider le panier après la mise à jour du stock
    setCartItems([])

    // Réinitialiser les totaux du panier
    setCartTotals({
      totalHT: 0,
      totalTTC: 0,
      totalTaxes: 0,
      originalTotal: 0,
      modifiedTotal: 0,
    })

    // Réinitialiser le type de paiement à 'CB'
    setPaymentType('CB')

    setAmountPaid('')
    setMultiplePayments([])
  }
  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        updateQuantity,
        removeItem,
        updatePrice,
        cartTotals,
        adjustmentAmount,
        setAdjustmentAmount,
        // taxRate,
        isModalOpen,
        setIsModalOpen,
        invoiceData,
        setInvoiceData,
        clearCart,
        paymentType,
        setPaymentType,
        amountPaid,
        setAmountPaid,
        multiplePayments,
        setMultiplePayments,
        paymentDetails,
        setPaymentDetails,
        cashDetails,
        setCashDetails,
        selectedPaymentType,
        setSelectedPaymentType,
        paymentAmount,
        setPaymentAmount,
        resetPaymentInfo,
        editingPayment,
        startEditingPayment,
        stopEditingPayment,
        calculateRemainingAmount,
        calculateChange,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
