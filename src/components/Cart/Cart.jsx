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
  } = useContext(CartContext)

  const [paymentType, setPaymentType] = useState('CB')

  const handlePayment = useHandlePayClick(paymentType, setInvoiceData)

  const isCurrentCartOnHold = onHoldInvoices.some(
    (invoice) => JSON.stringify(invoice.items) === JSON.stringify(cartItems),
  )

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
              <Grid item xs={12} md={12}>
                <Box mb={2}>
                  <FormControl fullWidth>
                    <InputLabel id="payment-type-label">
                      Type de paiement
                    </InputLabel>
                    <Select
                      labelId="payment-type-label"
                      id="payment-type-select"
                      value={paymentType}
                      label="Type de paiement"
                      size="small"
                      onChange={(event) => setPaymentType(event.target.value)}
                    >
                      <MenuItem value="CB">Carte Bancaire</MenuItem>
                      <MenuItem value="Cash">Espèces</MenuItem>
                      <MenuItem value="Cheque">Chèque</MenuItem>
                      <MenuItem value="ChequeCadeau">Chèque Cadeau</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Box mb={2}>
                <CartTotal />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '8px',
                }}
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
        </Grid>

        <OnHoldInvoices />
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
