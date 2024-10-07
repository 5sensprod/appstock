import React, { createContext, useState, useEffect } from 'react'
import {
  calculateTotal,
  calculateDiscountMarkup,
  calculateTax,
  applyCartDiscountOrMarkup,
} from '../utils/priceUtils'
import { updateLcdDisplay } from '../ipcHelper'
import { initializeWebSocket, sendMessage } from '../websocketClient'

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

  let isThankYouMessageDisplayed = false

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

  const [hasChanges, setHasChanges] = useState(false)

  const handleItemChange = () => {
    setHasChanges(true)

    // Recalculer les totaux avec les articles actuels du panier
    updateCartTotals(cartItems)

    // Envoyer les changements via WebSocket pour synchroniser les clients connectés
    sendMessage({
      type: 'CART_UPDATE',
      cartItems: cartItems,
    })
  }

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

  const [cashDetails, setCashDetails] = useState(initialCashDetails)

  useEffect(() => {
    console.log(
      `Valeurs actuelles : givenAmount = ${cashDetails.givenAmount}, changeAmount = ${cashDetails.changeAmount}`,
    )
  }, [cashDetails])

  const resetCashDetails = () => {
    setCashDetails(initialCashDetails)
  }

  const resetPaymentInfo = () => {
    setSelectedPaymentType('')
    setPaymentAmount('')
    setMultiplePayments([])
    setPaymentDetails([])
    setPaymentType('CB')
    setAmountPaid('')
    resetCashDetails()
  }

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

  const calculateCartTotals = (items) => {
    const totalHT = calculateTotal(items, (item) => item.prixHT)
    const totalTTC = calculateTotal(
      items,
      (item) => item.prixModifie ?? item.prixVente,
    )
    const totalTaxes = totalTTC - totalHT

    return { totalHT, totalTTC, totalTaxes }
  }

  useEffect(() => {
    initializeWebSocket((message) => {
      if (message && message.type === 'CART_UPDATE') {
        setCartItems(message.cartItems)
        updateCartTotals(message.cartItems)
        updateLcdDisplayFromCart(message.cartItems)
      } else if (message && message.type === 'DISCOUNT_UPDATE') {
        setAdjustmentAmount(message.adjustmentAmount)
        updateCartTotals(cartItems) // Recalcule les totaux avec la remise/majoration reçue
      } else if (message && message.type === 'DISPLAY_THANK_YOU_MESSAGE') {
        displayThankYouMessage() // Affiche le message de remerciement sur l'écran LCD
      } else {
        console.warn('Unexpected message type received:', message)
      }
    })

    sendMessage({ type: 'REQUEST_CART_SYNC' })
  }, [])

  const updateCartTotals = (items) => {
    const newCartTotals = calculateCartTotals(items)

    setCartTotals((prevTotals) => ({
      ...prevTotals,
      totalHT: newCartTotals.totalHT,
      totalTTC: newCartTotals.totalTTC,
      totalTaxes: newCartTotals.totalTaxes,
      originalTotal: newCartTotals.totalTTC,
    }))

    // Appliquer la remise ou la majoration si adjustmentAmount est différent de 0
    if (adjustmentAmount !== 0 && items.length > 0) {
      const adjustedTotal = applyCartDiscountOrMarkup(
        newCartTotals.totalTTC,
        adjustmentAmount,
      )
      setCartTotals((prevTotals) => ({
        ...prevTotals,
        modifiedTotal: adjustedTotal,
      }))

      // Envoyer la mise à jour de la remise ou de la majoration via WebSocket
      sendMessage({
        type: 'DISCOUNT_UPDATE',
        adjustmentAmount: adjustmentAmount,
        cartTotals: { ...prevTotals, modifiedTotal: adjustedTotal },
      })
    } else {
      // Réinitialiser le modifiedTotal si aucune remise ou majoration n'est appliquée
      setCartTotals((prevTotals) => ({
        ...prevTotals,
        modifiedTotal: newCartTotals.totalTTC,
      }))
    }
  }

  // src/contexts/CartContext.js

  const updateLcdDisplayFromCart = (items) => {
    if (isThankYouMessageDisplayed) {
      // Ne rien faire si le message de remerciement est affiché
      return
    }

    if (items.length > 0) {
      const lastItem = items[items.length - 1]
      const quantity = lastItem.quantity || 1
      const subtotal = parseFloat(lastItem.puTTC) * quantity
      const formattedSubtotal = subtotal
        .toLocaleString('fr-FR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          useGrouping: false,
        })
        .replace('.', ',')

      const quantityText = ` X${quantity}`
      const maxLineLength = 20
      let productReference = lastItem.reference || 'Produit'
      const availableSpace = maxLineLength - quantityText.length

      if (productReference.length > availableSpace) {
        productReference = productReference.substring(0, availableSpace)
      }

      const line1 = productReference + quantityText
      const priceText = `${formattedSubtotal} EUR`
      const totalPadding = maxLineLength - priceText.length
      const paddingLeft = Math.floor(totalPadding / 2)
      const paddingRight = totalPadding - paddingLeft

      const line2 =
        ' '.repeat(paddingLeft) + priceText + ' '.repeat(paddingRight)

      updateLcdDisplay({ line1, line2 })
    } else {
      updateLcdDisplay({
        line1: 'AXE MUSIQUE',
        line2: 'Panier vide',
      })
    }
  }

  const displayTotalOnLcd = () => {
    const total =
      adjustmentAmount !== 0
        ? cartTotals.modifiedTotal
        : cartTotals.originalTotal
    const formattedTotal = total.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: false, // Ne pas afficher les séparateurs de milliers
    })

    updateLcdDisplay({ line1: 'Total à payer', line2: `${formattedTotal} EUR` })
  }

  const displayThankYouMessage = () => {
    isThankYouMessageDisplayed = true
    updateLcdDisplay({
      line1: 'Merci',
      line2: 'À bientôt !',
    })

    // Après un délai de 5 secondes, réinitialiser la variable de contrôle et effacer l'écran
    setTimeout(() => {
      isThankYouMessageDisplayed = false
      updateLcdDisplay({ line1: '', line2: '' }) // Nettoie l'écran après 5 secondes
    }, 5000)
  }
  const applyDiscountOrMarkup = (discountOrMarkupAmount) => {
    setAdjustmentAmount(discountOrMarkupAmount)
    updateCartTotals(cartItems) // Recalcule les totaux avec la remise ou majoration appliquée
  }

  const addToCart = (product) => {
    setCartItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (item) => item._id === product._id,
      )
      if (existingItemIndex > -1) {
        const newItems = [...currentItems]
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1,
        }
        const updatedCartItems = newItems.map((item) => enrichCartItem(item))
        sendMessage({ type: 'CART_UPDATE', cartItems: updatedCartItems })
        updateCartTotals(updatedCartItems)
        updateLcdDisplayFromCart(updatedCartItems)
        return updatedCartItems
      } else {
        const newCartItems = [
          ...currentItems,
          enrichCartItem({ ...product, quantity: 1 }),
        ]
        sendMessage({ type: 'CART_UPDATE', cartItems: newCartItems })
        updateCartTotals(newCartItems)
        updateLcdDisplayFromCart(newCartItems)
        return newCartItems
      }
    })
    setHasChanges(true)
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
    } else {
      // Réinitialiser modifiedTotal si aucune remise ou majoration n'est appliquée
      setCartTotals((prevTotals) => ({
        ...prevTotals,
        modifiedTotal: newCartTotals.totalTTC,
      }))
    }

    // Réinitialiser adjustmentAmount si le panier est vide
    if (cartItems.length === 0) {
      setAdjustmentAmount(0)
    }
  }, [cartItems, adjustmentAmount])

  const updateQuantity = (productId, newQuantity) => {
    setCartItems((currentItems) => {
      const updatedCartItems = currentItems.map((item) =>
        item._id === productId
          ? enrichCartItem({ ...item, quantity: newQuantity })
          : item,
      )

      // Mettre à jour les totaux après avoir mis à jour l'état local
      updateCartTotals(updatedCartItems)

      // Utiliser un délai court pour garantir la cohérence du state avant d'envoyer via WebSocket
      setTimeout(() => {
        sendMessage({ type: 'CART_UPDATE', cartItems: updatedCartItems })
      }, 50) // 50 ms delay to ensure state consistency

      // Mettre à jour l'affichage LCD
      updateLcdDisplayFromCart(updatedCartItems)

      return updatedCartItems
    })
  }

  const updatePrice = (productId, newPrice) => {
    setCartItems((currentItems) => {
      const updatedCartItems = currentItems.map((item) =>
        item._id === productId
          ? enrichCartItem({ ...item, prixModifie: newPrice })
          : item,
      )
      sendMessage({ type: 'CART_UPDATE', cartItems: updatedCartItems })
      updateCartTotals(updatedCartItems)
      updateLcdDisplayFromCart(updatedCartItems)
      return updatedCartItems
    })
  }

  const removeItem = (productId) => {
    setCartItems((currentItems) => {
      const updatedCartItems = currentItems.filter(
        (item) => item._id !== productId,
      )
      sendMessage({ type: 'CART_UPDATE', cartItems: updatedCartItems })
      updateCartTotals(updatedCartItems)
      updateLcdDisplayFromCart(updatedCartItems)
      return updatedCartItems
    })
    setHasChanges(true)
  }

  const clearCart = () => {
    setCartItems([])
    setCartTotals({
      totalHT: 0,
      totalTTC: 0,
      totalTaxes: 0,
      originalTotal: 0,
      modifiedTotal: 0,
    })
    setPaymentType('CB')
    setAmountPaid('')
    setMultiplePayments([])
    sendMessage({ type: 'CART_UPDATE', cartItems: [] })
    updateLcdDisplayFromCart([])
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
        resetCashDetails,
        hasChanges,
        setHasChanges,
        handleItemChange,
        // applyDiscountOrMarkup,
        displayTotalOnLcd,
        displayThankYouMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
