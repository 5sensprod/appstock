import React, { useContext, useState } from 'react'
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
  } = useContext(CartContext)

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
    // Utiliser le total modifié si un ajustement a été appliqué, sinon utiliser le total original
    const total =
      adjustmentAmount !== 0
        ? cartTotals.modifiedTotal
        : cartTotals.originalTotal
    const paid = parseFloat(amountPaid)
    return paid > total ? paid - total : 0
  }
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          {cartItems.length > 0 ? (
            <>
              {cartItems.map((item) => (
                <Box key={item._id} mb={2}>
                  {' '}
                  {/* Déplacez la prop 'key' ici */}
                  <CartItem
                    item={item}
                    updateQuantity={updateQuantity}
                    updatePrice={updatePrice}
                    removeItem={removeItem}
                  />
                </Box>
              ))}

              <Box my={2}>
                <CartTotal />
              </Box>
              <Grid item xs={12} md={12}>
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
                    >
                      <MenuItem value="CB">Carte Bancaire</MenuItem>
                      <MenuItem value="Cash">Espèces</MenuItem>
                      <MenuItem value="Cheque">Chèque</MenuItem>
                      <MenuItem value="ChequeCadeau">Chèque Cadeau</MenuItem>
                    </Select>

                    {paymentType === 'Cash' && (
                      <Box my={2}>
                        <TextField
                          label="Montant Payé"
                          value={amountPaid}
                          onChange={(e) => setAmountPaid(e.target.value)}
                          type="number"
                        />
                      </Box>
                    )}

                    {paymentType === 'Cash' && (
                      <Box my={2}>
                        <Typography variant="h6">
                          {' '}
                          {/* Vous pouvez utiliser une chaîne de caractères pour des valeurs CSS spécifiques */}
                          Monnaie à rendre : {calculateChange().toFixed(2)} €
                        </Typography>
                      </Box>
                    )}
                  </FormControl>
                </Box>
              </Grid>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
                my={4}
              >
                {!isCurrentCartOnHold && cartItems.length > 0 && (
                  <Button
                    onClick={holdInvoice}
                    variant="contained"
                    sx={{ marginRight: '8px' }}
                  >
                    Mettre en attente
                  </Button>
                )}
                <Button
                  onClick={() => handlePayment(paymentType)}
                  variant="contained"
                  color="primary"
                >
                  Payer
                </Button>
              </Box>
            </>
          ) : (
            <Typography variant="h6">Votre panier est vide.</Typography>
          )}
          <Box my={3}>
            <OnHoldInvoices />
          </Box>
        </Grid>
      </Grid>{' '}
      {cartItems.length > 0 && (
        <Grid item xs={12} md={12}>
          <OrderSummary cartItems={cartItems} taxRate={taxRate} />
        </Grid>
      )}
      <InvoiceModal />
    </>
  )
}

export default Cart
