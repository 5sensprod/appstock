import React, { createContext, useContext, useState, useEffect } from 'react'
import { getInvoices, addInvoice } from '../api/invoiceService'

const InvoicesContext = createContext()

export const useInvoices = () => useContext(InvoicesContext)

export const InvoicesProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

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
    <InvoicesContext.Provider value={{ invoices, loading, createInvoice }}>
      {children}
    </InvoicesContext.Provider>
  )
}
