import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../contexts/CartContext'
import { useQuotes } from '../contexts/QuoteContext'
import { useUI } from '../contexts/UIContext'

export const useQuoteLogic = () => {
  const { cartItems, cartTotals, adjustmentAmount, clearCart } =
    useContext(CartContext)

  const {
    isActiveQuote,
    deactivateQuote,
    updateQuote,
    prepareQuoteData,
    activeQuoteDetails,
  } = useQuotes()

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleItemChange = () => {
    setHasChanges(true)
  }

  const { showToast } = useUI()
  const navigate = useNavigate()

  const handleSaveQuote = async () => {
    if (activeQuoteDetails && activeQuoteDetails.id) {
      try {
        const quoteData = prepareQuoteData(
          cartItems,
          cartTotals,
          adjustmentAmount,
        )
        await updateQuote(activeQuoteDetails.id, quoteData)
        showToast('Le devis a été sauvegardé avec succès.', 'success')
        clearCart()
        deactivateQuote()
        navigate('/dashboard#les-devis')
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du devis:', error)
        showToast('Erreur lors de la sauvegarde du devis.', 'error')
      }
    } else {
      showToast('Aucun devis actif à sauvegarder.', 'warning')
    }
  }

  const handleExitQuoteMode = () => {
    deactivateQuote()
    clearCart()
    navigate('/dashboard#les-devis')
  }

  const handleOpenQuoteModal = () => {
    setIsQuoteModalOpen(true)
  }

  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false)
  }

  return {
    handleSaveQuote,
    handleExitQuoteMode,
    handleOpenQuoteModal,
    handleCloseQuoteModal,
    isActiveQuote,
    isQuoteModalOpen,
    hasChanges,
    handleItemChange,
  }
}
