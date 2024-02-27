import React from 'react'
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'

const PaymentTypeSelector = ({
  paymentType,
  handlePaymentTypeChange,
  amountPaid,
  handleAmountPaidChange,
  calculateChange,
  isActiveQuote,
}) => {
  return (
    <Box mb={2}>
      <FormControl fullWidth>
        <InputLabel id="payment-type-label">Type de paiement</InputLabel>
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
          <MenuItem value="Virement">Virement</MenuItem>
          <MenuItem value="Avoir">Avoir</MenuItem>
        </Select>
        {paymentType === 'Cash' && (
          <>
            <Box my={2}>
              <TextField
                label="Montant Payé"
                value={amountPaid}
                onChange={handleAmountPaidChange}
                type="number"
                disabled={isActiveQuote}
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
  )
}

export default PaymentTypeSelector
