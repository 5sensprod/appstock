import React, { useContext, useState, useEffect } from 'react'
import { CartContext } from '../../contexts/CartContext'
import CartItem from './CartItem'
import OrderSummary from '../OrderSummary/OrderSummary'
import { Box, Typography, Button, Grid } from '@mui/material'
import InvoiceModal from '../invoice/InvoiceModal'
import OnHoldInvoices from '../invoice/OnHoldInvoices'
import CartTotal from './CartTotal'
import QuoteConfirmationModal from '../quote/QuoteConfirmationModal'
import { useQuotes } from '../../contexts/QuoteContext'
import { useNavigate } from 'react-router-dom'
import { useUI } from '../../contexts/UIContext'
import { useHoldInvoiceContext } from '../../contexts/HoldInvoiceContext'
import InvoiceConfirmationModal from '../invoice/InvoiceConfirmationModal'
import PaymentTypeSelector from './PaymentTypeSelector'

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    updatePrice,
    removeItem,
    taxRate,
    setInvoiceData,
    adjustmentAmount,
    cartTotals,
    clearCart,
    paymentType,
  } = useContext(CartContext)

  const {
    isActiveQuote,
    deactivateQuote,
    updateQuote,
    setActiveQuoteDetails,
    activeQuoteDetails,
    prepareQuoteData,
  } = useQuotes()

  const { onHoldInvoices, holdInvoice } = useHoldInvoiceContext()
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const { showToast } = useUI()

  const handleItemChange = () => {
    setHasChanges(true)
  }

  const navigate = useNavigate()

  const isCurrentCartOnHold = onHoldInvoices.some(
    (invoice) => JSON.stringify(invoice.items) === JSON.stringify(cartItems),
  )

  // Définir handleSaveQuote pour mettre à jour le devis actif
  const handleSaveQuote = async () => {
    if (activeQuoteDetails && activeQuoteDetails.id) {
      try {
        // Prépare les données du devis avec les données actuelles du panier et les informations du client
        const quoteData = prepareQuoteData(
          cartItems,
          cartTotals,
          adjustmentAmount,
        )
        // Mise à jour du devis avec les données préparées
        await updateQuote(activeQuoteDetails.id, quoteData)
        showToast('Le devis a été sauvegardé avec succès.', 'success')
        clearCart() // Optionnel: Effacer le panier après la mise à jour du devis
        deactivateQuote() // Désactiver le mode devis actif
        navigate('/dashboard#les-devis') // Redirection vers la page des devis
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

  const handleHoldAndClearCart = () => {
    holdInvoice(cartItems, cartTotals, adjustmentAmount) // Sauvegarde l'état actuel du panier
    clearCart()
    showToast('Facture mise en attente avec succès.', 'success')
  }

  // Fonction pour ouvrir le modal de confirmation de devis
  const handleOpenQuoteModal = () => {
    setIsQuoteModalOpen(true)
  }

  // La fonction pour fermer le modal et potentiellement gérer d'autres actions après fermeture
  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false)
    // Actions supplémentaires si nécessaire...
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          {cartItems.length > 0 ? (
            <>
              {cartItems.map((item) => (
                <Box key={item._id} mb={2}>
                  <CartItem
                    item={item}
                    updateQuantity={updateQuantity}
                    updatePrice={updatePrice}
                    removeItem={removeItem}
                    onItemChange={handleItemChange}
                  />
                </Box>
              ))}

              <Box my={2}>
                <CartTotal />
              </Box>
              <PaymentTypeSelector isActiveQuote={isActiveQuote} />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
                my={4}
              >
                <Button
                  onClick={() => setIsInvoiceModalOpen(true)}
                  variant="contained"
                  color="primary"
                >
                  Payer
                </Button>

                {!isActiveQuote && (
                  <>
                    {!isCurrentCartOnHold && cartItems.length > 0 && (
                      <Button
                        onClick={handleHoldAndClearCart}
                        variant="contained"
                        sx={{ ml: 2 }}
                      >
                        Mettre en attente
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleOpenQuoteModal}
                      sx={{ ml: 2 }}
                    >
                      Générer Devis
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={clearCart}
                      sx={{ ml: 2 }}
                    >
                      Vider panier
                    </Button>
                  </>
                )}
                {isActiveQuote && (
                  <>
                    <Button
                      variant="contained"
                      onClick={handleSaveQuote}
                      disabled={!hasChanges}
                      sx={{ ml: 2 }}
                    >
                      Sauvegarder le devis
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleExitQuoteMode}
                      sx={{ ml: 2 }}
                    >
                      Sortir
                    </Button>
                  </>
                )}
              </Box>
            </>
          ) : (
            <Typography variant="h6">Votre panier est vide.</Typography>
          )}
          <Box my={3}>
            <OnHoldInvoices />
          </Box>
        </Grid>
      </Grid>
      {cartItems.length > 0 && (
        <Grid item xs={12} md={12}>
          <OrderSummary cartItems={cartItems} taxRate={taxRate} />
        </Grid>
      )}
      <InvoiceModal />
      <QuoteConfirmationModal
        open={isQuoteModalOpen}
        onClose={handleCloseQuoteModal}
      />
      <InvoiceConfirmationModal
        open={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        paymentType={paymentType}
      />
    </>
  )
}

export default Cart
