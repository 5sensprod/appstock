import React, { useContext, useState, useEffect } from 'react'
import { CartContext } from '../../contexts/CartContext'
import CartItem from './CartItem'
import OrderSummary from '../OrderSummary/OrderSummary'
import {
  Box,
  Typography,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material'
import useHandlePayClick from '../../hooks/useHandlePayClick'
import InvoiceModal from '../invoice/InvoiceModal'
import OnHoldInvoices from '../invoice/OnHoldInvoices'
import CartTotal from './CartTotal'
import QuoteConfirmationModal from '../quote/QuoteConfirmationModal'
import { useQuotes } from '../../contexts/QuoteContext'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
  const {
    cartItems,
    onHoldInvoices,
    updateQuantity,
    updatePrice,
    removeItem,
    holdInvoice,
    taxRate,
    setInvoiceData,
    adjustmentAmount,
    cartTotals,
    clearCart,
  } = useContext(CartContext)

  const {
    isActiveQuote,
    deactivateQuote,
    updateQuote,
    setActiveQuoteDetails,
    activeQuoteDetails,
  } = useQuotes()

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const [quoteData, setQuoteData] = useState({
    items: [],
    totalHT: 0,
    totalTTC: 0,
  })

  const [hasChanges, setHasChanges] = useState(false)

  const handleItemChange = () => {
    setHasChanges(true)
  }

  const navigate = useNavigate()

  const prepareQuoteData = () => {
    const data = {
      items: cartItems.map((item) => ({
        id: item._id,
        reference: item.reference,
        quantity: item.quantity,
        prixHT: parseFloat(item.prixHT).toFixed(2),
        prixTTC: item.prixModifie
          ? parseFloat(item.prixModifie).toFixed(2)
          : parseFloat(item.prixVente).toFixed(2),
        prixOriginal: parseFloat(item.prixVente).toFixed(2),
        tauxTVA: item.tva,
        totalTTCParProduit: (parseFloat(item.puTTC) * item.quantity).toFixed(2),
        remiseMajorationLabel: item.remiseMajorationLabel || '',
        remiseMajorationValue: item.remiseMajorationValue || 0,
      })),
      totalHT: parseFloat(cartTotals.totalHT).toFixed(2),
      totalTTC: parseFloat(cartTotals.totalTTC).toFixed(2),
    }
    setQuoteData(data)
    setIsQuoteModalOpen(true)
  }

  useEffect(() => {
    setQuoteData({
      items: cartItems.map((item) => ({
        id: item._id,
        reference: item.reference,
        quantity: item.quantity,
        prixHT: parseFloat(item.prixHT).toFixed(2),
        prixTTC: item.prixModifie
          ? parseFloat(item.prixModifie).toFixed(2)
          : parseFloat(item.prixVente).toFixed(2),
        prixOriginal: parseFloat(item.prixVente).toFixed(2),
        tauxTVA: item.tva,
        totalTTCParProduit: (parseFloat(item.puTTC) * item.quantity).toFixed(2),
        remiseMajorationLabel: item.remiseMajorationLabel || '',
        remiseMajorationValue: item.remiseMajorationValue || 0,
      })),
      totalHT: parseFloat(cartTotals.totalHT).toFixed(2),
      totalTTC: parseFloat(cartTotals.totalTTC).toFixed(2),
      // Assurez-vous d'inclure toutes les données nécessaires
    })
  }, [cartItems, cartTotals])

  const [paymentType, setPaymentType] = useState('CB')
  const [amountPaid, setAmountPaid] = useState('')

  const handlePayment = useHandlePayClick(paymentType, setInvoiceData)

  const isCurrentCartOnHold = onHoldInvoices.some(
    (invoice) => JSON.stringify(invoice.items) === JSON.stringify(cartItems),
  )

  const handlePaymentTypeChange = (event) => {
    setPaymentType(event.target.value)
  }

  const calculateChange = () => {
    const total =
      adjustmentAmount !== 0
        ? cartTotals.modifiedTotal
        : cartTotals.originalTotal
    const paid = parseFloat(amountPaid)
    return paid > total ? paid - total : 0
  }

  // Définir handleSaveQuote pour mettre à jour le devis actif
  const handleSaveQuote = async () => {
    if (activeQuoteDetails && activeQuoteDetails.id) {
      try {
        console.log(quoteData)
        await updateQuote(activeQuoteDetails.id, quoteData)
        alert('Le devis a été sauvegardé avec succès.')
        deactivateQuote() // Optionnel : Désactiver le mode devis après mise à jour
        clearCart()
        navigate('/dashboard#les-devis')
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du devis:', error)
        alert('Erreur lors de la sauvegarde du devis.')
      }
    } else {
      alert('Aucun devis actif à sauvegarder.')
    }
  }
  const handleExitQuoteMode = () => {
    deactivateQuote()
    clearCart()
    navigate('/dashboard#les-devis')
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

              <Box mb={2}>
                <FormControl fullWidth>
                  <InputLabel id="payment-type-label">
                    Type de paiement
                  </InputLabel>
                  <Select
                    labelId="payment-type-label"
                    value={paymentType}
                    onChange={handlePaymentTypeChange}
                    label="Type de paiement"
                    disabled={isActiveQuote} // Désactiver la sélection en mode devis
                  >
                    <MenuItem value="CB">Carte Bancaire</MenuItem>
                    <MenuItem value="Cash">Espèces</MenuItem>
                    <MenuItem value="Cheque">Chèque</MenuItem>
                    <MenuItem value="ChequeCadeau">Chèque Cadeau</MenuItem>
                  </Select>
                  {paymentType === 'Cash' && (
                    <>
                      <Box my={2}>
                        <TextField
                          label="Montant Payé"
                          value={amountPaid}
                          onChange={(e) => setAmountPaid(e.target.value)}
                          type="number"
                          disabled={isActiveQuote} // Désactiver la saisie en mode devis
                        />
                      </Box>
                      <Box my={2}>
                        <Typography variant="h6">
                          Monnaie à rendre : {calculateChange().toFixed(2)} €
                        </Typography>
                      </Box>
                    </>
                  )}
                </FormControl>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
                my={4}
              >
                <Button
                  onClick={() => handlePayment(paymentType)}
                  variant="contained"
                  color="primary"
                >
                  Payer
                </Button>

                {!isActiveQuote && (
                  <>
                    {!isCurrentCartOnHold && cartItems.length > 0 && (
                      <Button
                        onClick={holdInvoice}
                        variant="contained"
                        sx={{ ml: 2 }}
                      >
                        Mettre en attente
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={prepareQuoteData}
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
                      color="error"
                      onClick={deactivateQuote}
                      sx={{ ml: 2 }}
                    >
                      Supprimer ce devis
                    </Button>
                    {/* Implémenter la logique de sortie ici */}
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
        onClose={() => setIsQuoteModalOpen(false)}
        cartItems={cartItems}
        cartTotals={cartTotals}
        adjustmentAmount={adjustmentAmount}
      />
    </>
  )
}

export default Cart
