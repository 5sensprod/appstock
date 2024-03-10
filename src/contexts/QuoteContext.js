import React, { createContext, useContext, useState, useEffect } from 'react'
import * as quoteService from '../api/quoteService'
import { CartContext } from './CartContext'

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
  const [customerAdress, setCustomerAdress] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')

  const [isActiveQuote, setIsActiveQuote] = useState(false)
  const [activeQuoteDetails, setActiveQuoteDetails] = useState({
    quoteNumber: '',
    contact: '',
  })

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
          quote._id === id ? { ...quote, ...quoteData } : quote,
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
      setQuotes(quotes.filter((quote) => quote._id !== id))
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Activer un devis
  const activateQuote = (quote) => {
    setIsActiveQuote(true)
    setActiveQuoteDetails(quote)
    // Optionnellement, initialisez également les informations du client si elles sont disponibles
    if (quote.customerInfo) {
      setCustomerName(quote.customerInfo.name || '')
      setCustomerEmail(quote.customerInfo.email || '')
      setCustomerPhone(quote.customerInfo.phone || '')
    }
  }

  const prepareQuoteData = (cartItems, cartTotals, adjustmentAmount) => {
    const items = cartItems.map((item, index) => {
      // Structure de base pour chaque item
      const itemData = {
        id: item._id || index,
        reference: item.reference,
        quantity: item.quantity,
        prixHT: parseFloat(item.prixHT).toFixed(2),
        prixTTC: parseFloat(item.puTTC).toFixed(2),
        prixVente: parseFloat(item.prixVente).toFixed(2),
        tauxTVA: item.tauxTVA,
        totalTTCParProduit: parseFloat(item.puTTC * item.quantity).toFixed(2),
        remiseMajorationLabel: item.remiseMajorationLabel || '',
        remiseMajorationValue: item.remiseMajorationValue || 0,
      }

      // Conditionnellement ajouter le prixOriginal si le prix a été modifié
      if (
        item.prixModifie &&
        parseFloat(item.prixModifie) !== parseFloat(item.prixVente)
      ) {
        itemData.prixOriginal = parseFloat(item.prixVente).toFixed(2)
      }

      return itemData
    })

    const quoteData = {
      items,
      totalHT: parseFloat(cartTotals.totalHT).toFixed(2),
      totalTTC: parseFloat(cartTotals.totalTTC).toFixed(2),
      adjustmentAmount,
    }

    return quoteData
  }
  // Désactiver le devis actif
  const deactivateQuote = () => {
    setIsActiveQuote(false)
    setActiveQuoteDetails({})
    // Réinitialiser les informations du client si nécessaire
    setCustomerName('')
    setCustomerEmail('')
    setCustomerPhone('')
  }

  const handleDeleteQuote = async () => {
    if (activeQuoteDetails && activeQuoteDetails.id) {
      await deleteQuote(activeQuoteDetails.id)
      deactivateQuote()
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
        customerAdress,
        setCustomerAdress,
        customerEmail,
        setCustomerEmail,
        customerPhone,
        setCustomerPhone,
        isActiveQuote,
        activeQuoteDetails,
        activateQuote,
        setActiveQuoteDetails,
        deactivateQuote,
        setIsActiveQuote,
        handleDeleteQuote,
        prepareQuoteData,
      }}
    >
      {children}
    </QuoteContext.Provider>
  )
}
