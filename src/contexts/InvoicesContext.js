import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  getInvoices,
  addInvoice,
  incrementPdfGenerationCount,
} from '../api/invoiceService'
import { getTickets, addTicket } from '../api/ticketService'
import { incrementPdfGenerationCount as incrementTicketPdfGenerationCount } from '../api/ticketService'
import { useConfig } from './ConfigContext'

const InvoicesContext = createContext()

export const useInvoices = () => useContext(InvoicesContext)

export const InvoicesProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([])
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const { baseUrl } = useConfig()

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

  useEffect(() => {
    const eventSource = new EventSource(`${baseUrl}/api/events`)

    const handleEvent = (event) => {
      const data = JSON.parse(event.data)
      switch (data.type) {
        case 'ticket-added':
          // Re-fetch des tickets à chaque ajout pour assurer la synchronisation
          fetchTickets()
          break
        case 'invoice-added':
          // Re-fetch des invoices à chaque ajout pour assurer la synchronisation
          fetchInvoices()
          break
        // Pas besoin d'une gestion de cas par défaut si aucun autre type d'événement n'est traité
      }
    }

    eventSource.onmessage = handleEvent
    eventSource.onerror = (error) => {
      console.error('SSE error:', error) // Garder pour déboguer les erreurs de connexion SSE
    }

    return () => {
      eventSource.close()
    }
  }, [baseUrl, fetchTickets, fetchInvoices])

  useEffect(() => {
    fetchInvoices()
    fetchTickets()
  }, [])

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

  const handleIncrementPdfGenerationCount = async (id, type) => {
    try {
      // Décider quel service appeler en fonction du type
      if (type === 'invoice') {
        await incrementPdfGenerationCount(id)
        await fetchInvoices() // Rafraîchir les données des factures après l'incrémentation
      } else if (type === 'ticket') {
        await incrementTicketPdfGenerationCount(id)
        await fetchTickets() // Rafraîchir les données des tickets après l'incrémentation
      }
    } catch (error) {
      console.error(
        `Erreur lors de l'incrémentation du compteur de génération PDF pour le type: ${type}`,
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
