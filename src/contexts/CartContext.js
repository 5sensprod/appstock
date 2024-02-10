import { useProductContextSimplified } from './ProductContextSimplified'
import React, { createContext, useState, useEffect } from 'react'
import {
  calculateTotal,
  calculateDiscountMarkup,
  calculateTax,
  calculateTotalItem,
  applyCartDiscountOrMarkup,
  recalculateTotalHTFromDiscountedTTC,
  recalculateTotalTaxFromHTandTTC,
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
    const tauxTVA = item.tva // Utilisez directement le taux de TVA du produit
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

  const updateTotalWithAdjustment = (adjustment) => {
    // Appliquer l'ajustement au total TTC pour obtenir le total TTC ajusté
    const adjustedTotalTTC = applyCartDiscountOrMarkup(
      cartTotals.totalTTC,
      adjustment,
    )

    // Initialiser les valeurs pour le recalcul
    let newTotalHT = 0
    let totalTaxAmount = 0

    // Recalculer le total HT et les taxes basés sur le total TTC ajusté
    cartItems.forEach((item) => {
      const taxRateForItem = item.tva / 100
      // Calculer la part du prix HT de chaque produit basé sur le prix ajusté et le taux de TVA
      const priceToUse = item.prixModifie ?? item.prixVente
      const itemTotalTTC = priceToUse * item.quantity
      const itemShareOfTotalTTC =
        (itemTotalTTC / cartTotals.totalTTC) * adjustedTotalTTC
      const itemTotalHT = itemShareOfTotalTTC / (1 + taxRateForItem)
      const itemTaxAmount = itemShareOfTotalTTC - itemTotalHT

      // Ajouter à la somme totale HT et au montant total de la TVA
      newTotalHT += itemTotalHT
      totalTaxAmount += itemTaxAmount
    })

    // Mettre à jour les totaux dans l'état du contexte
    setCartTotals((prevTotals) => ({
      ...prevTotals,
      totalHT: newTotalHT,
      totalTaxes: totalTaxAmount,
      modifiedTotal: adjustedTotalTTC,
    }))

    setAdjustmentAmount(adjustment)

    if (invoiceData) {
      setInvoiceData({
        ...invoiceData,
        totalModified: adjustedTotalTTC,
        adjustment: adjustment,
      })
    }
  }

  // Mettez à jour les totaux chaque fois que le panier est modifié
  useEffect(() => {
    const newCartTotals = calculateCartTotals(cartItems)
    setCartTotals((prevTotals) => ({
      ...prevTotals,
      totalHT: newCartTotals.totalHT,
      totalTTC: newCartTotals.totalTTC,
      totalTaxes: newCartTotals.totalTaxes,
      originalTotal: newCartTotals.totalTTC,
      // Ne pas mettre à jour modifiedTotal ici pour éviter de perdre l'ajustement lors des mises à jour du panier
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
    setAdjustmentAmount(invoice.adjustmentAmount) // Réinitialiser adjustmentAmount à la valeur de la facture en attente

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
        // Le produit est déjà dans le panier
        const newItems = [...currentItems]
        newItems[itemIndex].quantity += 1

        // Mettre à jour le stock si nécessaire
        if (newItems[itemIndex].stock !== null) {
          const newStock = newItems[itemIndex].stock - 1
          newItems[itemIndex].stock = newStock
          updateProductInContext(product._id, { stock: newStock })
        }
        setUpdateTrigger((prev) => !prev)
        return newItems
      } else {
        // Ajouter un nouveau produit au panier
        const newItem = enrichCartItem({
          ...product,
          quantity: 1,
          stock: product.stock - 1,
        })
        if (product.stock !== null) {
          updateProductInContext(product._id, { stock: newItem.stock })
        }
        return [...currentItems, newItem]
      }
    })
  }

  // Mettre à jour la quantité d'un produit dans le panier
  const updateQuantity = (productId, newQuantity) => {
    setCartItems((currentItems) => {
      return currentItems.map((item) => {
        if (item._id === productId) {
          // Calculer le changement de quantité
          const quantityChange = newQuantity - item.quantity

          // Mettre à jour le stock
          if (item.stock !== null) {
            const newStock = item.stock - quantityChange
            updateProductInContext(productId, { stock: newStock })
            return enrichCartItem({
              ...item,
              quantity: newQuantity,
              stock: newStock,
            })
          }

          return enrichCartItem({ ...item, quantity: newQuantity })
        }
        return item
      })
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
    setCartItems((currentItems) => {
      const itemIndex = currentItems.findIndex((item) => item._id === productId)

      if (itemIndex > -1) {
        const item = currentItems[itemIndex]
        // Rétablir le stock si nécessaire
        if (item.stock !== null) {
          updateProductInContext(productId, {
            stock: item.stock + item.quantity,
          })
        }
      }

      return currentItems.filter((item) => item._id !== productId)
    })
  }

  // Vider panier
  const clearCart = () => {
    // Parcourir les articles du panier actuel pour rétablir le stock
    cartItems.forEach((item) => {
      if (item.stock !== null) {
        // Calculer le nouveau stock
        const newStock = item.stock + item.quantity
        // Mettre à jour le stock du produit dans le contexte
        updateProductInContext(item._id, { stock: newStock })
      }
    })

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
        updateTotalWithAdjustment,
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
