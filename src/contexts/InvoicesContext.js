// src/contexts/InvoicesContext.js
import React, { createContext, useContext, useState, useEffect } from 'react'
import { getInvoices } from '../api/invoiceService'

const InvoicesContext = createContext()

export const useInvoices = () => useContext(InvoicesContext)

export const InvoicesProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true)
      try {
        const data = await getInvoices() // Adaptez cette ligne si nécessaire pour passer des paramètres de date
        setInvoices(data)
      } catch (error) {
        console.error('Erreur lors de la récupération des factures:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  return (
    <InvoicesContext.Provider value={{ invoices, loading }}>
      {children}
    </InvoicesContext.Provider>
  )
}
