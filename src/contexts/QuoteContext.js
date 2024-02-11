import React, { createContext, useContext, useState, useEffect } from 'react'
import * as quoteService from '../api/quoteService'

// Création du contexte
export const QuoteContext = createContext()

// Utilisation d'un Hook pour faciliter l'accès au contexte
export const useQuotes = () => useContext(QuoteContext)

// Fournisseur du contexte
export const QuoteProvider = ({ children }) => {
  const [quotes, setQuotes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')

  // Charger tous les devis au démarrage
  useEffect(() => {
    const fetchQuotes = async () => {
      setIsLoading(true)
      try {
        const data = await quoteService.getQuotes()
        setQuotes(data)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuotes()
  }, [])

  // Ajouter un devis
  const addQuote = async (quoteData) => {
    setIsLoading(true)
    try {
      const newQuote = await quoteService.addQuote(quoteData)
      setQuotes([...quotes, newQuote])
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Mettre à jour un devis
  const updateQuote = async (id, quoteData) => {
    setIsLoading(true)
    try {
      await quoteService.updateQuote(id, quoteData)
      setQuotes(
        quotes.map((quote) =>
          quote.id === id ? { ...quote, ...quoteData } : quote,
        ),
      )
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Supprimer un devis
  const deleteQuote = async (id) => {
    setIsLoading(true)
    try {
      await quoteService.deleteQuote(id)
      setQuotes(quotes.filter((quote) => quote.id !== id))
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <QuoteContext.Provider
      value={{
        quotes,
        addQuote,
        updateQuote,
        deleteQuote,
        isLoading,
        error,
        customerName,
        setCustomerName,
        customerEmail,
        setCustomerEmail,
        customerPhone,
        setCustomerPhone,
      }}
    >
      {children}
    </QuoteContext.Provider>
  )
}
