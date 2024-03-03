import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  getInvoices,
  addInvoice,
  incrementPdfGenerationCount,
} from '../api/invoiceService'
import { getTickets, addTicket } from '../api/ticketService'

const InvoicesContext = createContext()

export const useInvoices = () => useContext(InvoicesContext)

export const InvoicesProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([])
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvoices()
    fetchTickets()
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

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const data = await getTickets()
      setTickets(data)
    } catch (error) {
      console.error('Erreur lors de la récupération des tickets:', error)
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
      prixTTC: parseFloat(item.puTTC).toFixed(2),
      tauxTVA: item.tauxTVA,
      totalTTCParProduit: parseFloat(item.puTTC * item.quantity).toFixed(2),
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
      fetchInvoices()
      return newInvoice
    } catch (error) {
      console.error("Erreur lors de l'ajout de la facture:", error)
      throw error
    }
  }

  const createTicket = async (ticketData) => {
    try {
      const newTicket = await addTicket(ticketData)
      fetchTickets()
      return newTicket
    } catch (error) {
      console.error("Erreur lors de l'ajout du ticket:", error)
      throw error
    }
  }

  const handleIncrementPdfGenerationCount = async (invoiceId) => {
    try {
      console.log(
        `Incrément du compteur de génération de PDF pour la facture ID: ${invoiceId}`,
      )
      await incrementPdfGenerationCount(invoiceId)
      console.log(
        `Compteur de génération de PDF incrémenté pour la facture ID: ${invoiceId}`,
      )
      // Optionnel: Rafraîchir les données des factures après l'incrémentation
      await fetchInvoices()
    } catch (error) {
      console.error(
        "Erreur lors de l'incrémentation du compteur de génération PDF:",
        error,
      )
    }
  }

  return (
    <InvoicesContext.Provider
      value={{
        invoices,
        tickets,
        loading,
        createInvoice,
        prepareInvoiceData,
        createTicket,
        handleIncrementPdfGenerationCount,
      }}
    >
      {children}
    </InvoicesContext.Provider>
  )
}
