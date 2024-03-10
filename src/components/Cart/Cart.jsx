import React, { useContext, useState } from 'react'
import { CartContext } from '../../contexts/CartContext'
import CartItem from './CartItem'
import OrderSummary from '../OrderSummary/OrderSummary'
import { Box, Typography, Button, Grid } from '@mui/material'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import InvoiceModal from '../invoice/InvoiceModal'
import OnHoldInvoices from '../invoice/OnHoldInvoices'
import CartTotal from './CartTotal'
import QuoteConfirmationModal from '../quote/QuoteConfirmationModal'
import { useHoldInvoiceContext } from '../../contexts/HoldInvoiceContext'
import InvoiceConfirmationModal from '../invoice/InvoiceConfirmationModal'
import { useQuoteLogic } from '../../hooks/useQuoteLogic'

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    updatePrice,
    removeItem,
    taxRate,
    clearCart,
    paymentType,
    resetPaymentInfo,
    adjustmentAmount,
    cartTotals,
  } = useContext(CartContext)

  const {
    handleSaveQuote,
    handleExitQuoteMode,
    handleOpenQuoteModal,
    handleCloseQuoteModal,
    isActiveQuote,
    isQuoteModalOpen,
  } = useQuoteLogic()

  const { onHoldInvoices, holdInvoice } = useHoldInvoiceContext()
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  // const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleItemChange = () => {
    setHasChanges(true)
  }

  const isCurrentCartOnHold = onHoldInvoices.some(
    (invoice) => JSON.stringify(invoice.items) === JSON.stringify(cartItems),
  )

  const handleHoldAndClearCart = () => {
    holdInvoice(cartItems, cartTotals, adjustmentAmount) // Sauvegarde l'état actuel du panier
    clearCart()
    showToast('Facture mise en attente avec succès.', 'success')
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          {cartItems.length > 0 ? (
            <>
              {cartItems.map((item) => (
                <Box key={item._id} mb={1}>
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
              {/* <PaymentTypeSelector isActiveQuote={isActiveQuote} /> */}
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
                      color="success"
                      onClick={handleSaveQuote}
                      disabled={!hasChanges}
                      sx={{ ml: 2 }}
                    >
                      Sauvegarder le devis
                    </Button>
                    <Button
                      variant="contained"
                      // color="error"
                      onClick={handleExitQuoteMode}
                      sx={{
                        ml: 2,
                        minWidth: '40px',
                        width: '40px',
                        height: '40px',
                        borderRadius: '10%',
                        padding: '6px',
                        '&:hover': {
                          backgroundColor: 'dark',
                        },
                      }}
                      aria-label="sortir"
                    >
                      <ExitToAppIcon sx={{ color: '#fff' }} />{' '}
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
        onClose={() => {
          resetPaymentInfo()
          setIsInvoiceModalOpen(false)
        }}
        paymentType={paymentType}
      />
    </>
  )
}

export default Cart
