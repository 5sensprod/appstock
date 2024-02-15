import React, { createContext, useState, useContext } from 'react'

export const HoldInvoiceContext = createContext()

// Utilisation d'un Hook pour faciliter l'accès au contexte
export const useHoldInvoiceContext = () => {
  const context = useContext(HoldInvoiceContext)
  if (context === undefined) {
    throw new Error(
      'useHoldInvoiceContext must be used within a HoldInvoiceProvider',
    )
  }
  return context
}

export const HoldInvoiceProvider = ({ children }) => {
  const [onHoldInvoices, setOnHoldInvoices] = useState([])

  const holdInvoice = (cartItems, cartTotals, adjustmentAmount) => {
    const newInvoice = {
      id: Date.now(),
      items: cartItems,
      totalHT: cartTotals.totalHT,
      totalTaxes: cartTotals.totalTaxes,
      totalTTC:
        adjustmentAmount !== 0 ? cartTotals.modifiedTotal : cartTotals.totalTTC,
      adjustmentAmount,
    }
    setOnHoldInvoices((prevInvoices) => [...prevInvoices, newInvoice])
  }

  const resumeInvoice = (index) => {
    const invoice = onHoldInvoices[index]
    // Cette fonction retournera l'objet facture pour que le composant consommateur puisse l'utiliser
    // pour mettre à jour l'état du panier dans `CartContext`.
    return invoice
  }

  const deleteInvoice = (index) => {
    setOnHoldInvoices((prevInvoices) => {
      return prevInvoices.filter((_, i) => i !== index)
    })
  }

  return (
    <HoldInvoiceContext.Provider
      value={{ onHoldInvoices, holdInvoice, resumeInvoice, deleteInvoice }}
    >
      {children}
    </HoldInvoiceContext.Provider>
  )
}
