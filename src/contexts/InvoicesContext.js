import React, { createContext, useContext, useState, useEffect } from 'react'
import { getInvoices, addInvoice } from '../api/invoiceService'

const InvoicesContext = createContext()

export const useInvoices = () => useContext(InvoicesContext)

export const InvoicesProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const data = await getInvoices()
      setInvoices(data)
    } catch (error) {
      console.error('Erreur lors de la récupération des factures:', error)
    } finally {
      setLoading(false)
    }
  }

  const prepareInvoiceData = (cartItems, cartTotals, adjustmentAmount) => {
    const items = cartItems.map((item, index) => ({
      id: item._id || index,
      reference: item.reference,
      quantity: item.quantity,
      prixHT: parseFloat(item.prixHT).toFixed(2),
      prixTTC: parseFloat(item.puTTC).toFixed(2), // Utilise puTTC pour le prix TTC
      tauxTVA: item.tauxTVA,
      totalTTCParProduit: parseFloat(item.puTTC * item.quantity).toFixed(2), // Calcul du total TTC par produit
      remiseMajorationLabel: item.remiseMajorationLabel || '',
      remiseMajorationValue: item.remiseMajorationValue || 0,
    }))

    const totals = {
      totalHT: parseFloat(cartTotals.totalHT).toFixed(2),
      totalTTC: parseFloat(cartTotals.totalTTC + adjustmentAmount).toFixed(2),
      adjustmentAmount,
    }

    return { items, totals }
  }

  const createInvoice = async (invoiceData) => {
    try {
      const newInvoice = await addInvoice(invoiceData)
      fetchInvoices() // Rafraîchir la liste des factures après l'ajout
      return newInvoice
    } catch (error) {
      console.error("Erreur lors de l'ajout de la facture:", error)
      throw error
    }
  }

  return (
    <InvoicesContext.Provider
      value={{
        invoices,
        loading,
        createInvoice,
        prepareInvoiceData,
        customerName,
        setCustomerName,
        customerEmail,
        setCustomerEmail,
        customerPhone,
        setCustomerPhone,
      }}
    >
      {children}
    </InvoicesContext.Provider>
  )
}
