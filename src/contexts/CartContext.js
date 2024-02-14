import { useProductContextSimplified } from './ProductContextSimplified'
import React, { createContext, useState, useEffect } from 'react'
import {
  calculateTotal,
  calculateDiscountMarkup,
  calculateTax,
  calculateTotalItem,
  applyCartDiscountOrMarkup,
} from '../utils/priceUtils'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const { updateProductInContext } = useProductContextSimplified()
  const [cartItems, setCartItems] = useState([])
  const [onHoldInvoices, setOnHoldInvoices] = useState([])
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
  const [updateTrigger, setUpdateTrigger] = useState(false)

  const enrichCartItem = (item) => {
    const priceToUse = item.prixModifie ?? item.prixVente
    const taxRateForItem = item.tva / 100
    const prixHT = priceToUse / (1 + taxRateForItem)
    const montantTVA = calculateTax(prixHT, taxRateForItem)
    const tauxTVA = item.tva
    const totalItem = calculateTotalItem(item)

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

  // Mettre la facture en attente
  const holdInvoice = () => {
    const newInvoice = {
      id: Date.now(),
      items: cartItems.map((item) => ({
        ...item,
        prixModifie: item.prixModifie,
      })),
      totalHT: cartTotals.totalHT,
      totalTVA: cartTotals.totalTaxes,
      totalTTC:
        adjustmentAmount !== 0 ? cartTotals.modifiedTotal : cartTotals.totalTTC,
      adjustmentAmount: adjustmentAmount,
    }
    setOnHoldInvoices((prevInvoices) => [...prevInvoices, newInvoice])
    setCartItems([])
    setAdjustmentAmount(0) // Réinitialiser adjustmentAmount
  }

  // Reprendre une facture en attente
  const resumeInvoice = (index) => {
    const invoice = onHoldInvoices[index]
    const invoiceItems = invoice.items.map((item) => ({
      ...item,
      // Restaurez le prixModifie et le prixVente
      prixVente: item.prixVente,
      prixModifie: item.prixModifie,
    }))

    setCartItems(invoiceItems)
    setAdjustmentAmount(invoice.adjustmentAmount)

    // Optionnellement, vous pouvez décider de conserver ou non la facture dans onHoldInvoices
    setOnHoldInvoices((prevInvoices) =>
      prevInvoices.filter((_, i) => i !== index),
    )
  }

  const deleteInvoice = (index) => {
    setOnHoldInvoices((prevInvoices) => {
      const invoiceToDelete = prevInvoices[index]

      if (invoiceToDelete && invoiceToDelete.items) {
        invoiceToDelete.items.forEach((item) => {
          if (item.stock !== null) {
            // Rétablir le stock dans la base de données
            const newStock = item.stock + item.quantity
            updateProductInContext(item._id, { stock: newStock })
          }
        })
      }

      // Supprimer la facture
      return prevInvoices.filter((_, i) => i !== index)
    })
  }

  // Ajouter un produit au panier
  const addToCart = (product) => {
    setCartItems((currentItems) => {
      const itemIndex = currentItems.findIndex(
        (item) => item._id === product._id,
      )
      if (itemIndex > -1) {
        // Le produit est déjà dans le panier, augmenter seulement la quantité
        const newItems = [...currentItems]
        newItems[itemIndex].quantity += 1
        return newItems
      } else {
        // Ajouter un nouveau produit au panier avec une quantité initiale de 1
        return [...currentItems, { ...enrichCartItem(product), quantity: 1 }]
      }
    })
  }

  // Mettre à jour la quantité d'un produit dans le panier
  const updateQuantity = (productId, newQuantity) => {
    setCartItems((currentItems) => {
      return currentItems.map((item) =>
        item._id === productId ? { ...item, quantity: newQuantity } : item,
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

    // Réinitialiser d'autres états liés au panier ici si nécessaire
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        onHoldInvoices,
        addToCart,
        updateQuantity,
        removeItem,
        holdInvoice,
        resumeInvoice,
        deleteInvoice,
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
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
