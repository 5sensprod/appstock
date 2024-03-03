import React, { useState, useContext } from 'react'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import usePaymentHandlers from './usePaymentHandlers'
import { CartContext } from '../../contexts/CartContext'

const MultiplePaymentInput = ({ onAddPayment, remainingAmount }) => {
  const {
    selectedPaymentType,
    setSelectedPaymentType,
    paymentAmount,
    setPaymentAmount,
  } = useContext(CartContext)

  const handleAddPayment = () => {
    if (!selectedPaymentType || paymentAmount <= 0) {
      alert(
        'Veuillez sélectionner un type de paiement et entrer un montant valide.',
      )
      return
    }
    onAddPayment({
      type: selectedPaymentType,
      amount: parseFloat(paymentAmount),
    })
    setSelectedPaymentType('')
    setPaymentAmount('')
  }

  return (
    <Box>
      <FormControl fullWidth margin="normal">
        <InputLabel>Type de paiement</InputLabel>
        <Select
          value={selectedPaymentType}
          onChange={(e) => setSelectedPaymentType(e.target.value)}
          label="Type de paiement"
        >
          <MenuItem value="CB">Carte Bancaire</MenuItem>
          <MenuItem value="Cash">Espèces</MenuItem>
          <MenuItem value="Cheque">Chèque</MenuItem>
          <MenuItem value="ChequeCadeau">Chèque Cadeau</MenuItem>
          <MenuItem value="Virement">Virement</MenuItem>
          <MenuItem value="Avoir">Avoir</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Montant"
        type="number"
        value={paymentAmount}
        onChange={(e) => setPaymentAmount(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button onClick={handleAddPayment} variant="contained" sx={{ mt: 2 }}>
        Ajouter
      </Button>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Restant à payer: {parseFloat(remainingAmount).toFixed(2)} €
      </Typography>
    </Box>
  )
}

const PaymentList = ({ payments, onRemove, onUpdate }) => {
  const [editing, setEditing] = useState({ index: null, value: '' })

  const handleEditClick = (index, amount) => {
    setEditing({ index, value: amount.toString() })
  }

  const handleUpdate = (index) => {
    if (editing.value) {
      const updatedPayment = {
        ...payments[index],
        amount: parseFloat(editing.value),
      }
      onUpdate(index, updatedPayment)
    }
    setEditing({ index: null, value: '' })
  }

  return (
    <Box>
      {payments.map((payment, index) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1 }}
        >
          {editing.index === index ? (
            <TextField
              key={`edit-${index}`}
              size="small"
              variant="outlined"
              value={editing.value}
              autoFocus
              onInput={(e) => setEditing({ ...editing, value: e.target.value })}
              style={{ marginRight: '10px' }}
              type="number"
            />
          ) : (
            <Typography>{`${payment.type}: ${payment.amount}€`}</Typography>
          )}

          {editing.index === index ? (
            <Button onClick={() => handleUpdate(index)}>Valider</Button>
          ) : (
            <Button onClick={() => handleEditClick(index, payment.amount)}>
              Modifier
            </Button>
          )}

          <Button onClick={() => onRemove(index)} sx={{ ml: 1 }}>
            Supprimer
          </Button>
        </Box>
      ))}
    </Box>
  )
}

const PaymentTypeSelector = ({ isActiveQuote }) => {
  const {
    paymentType,
    amountPaid,
    handlePaymentTypeChange,
    handleAmountPaidChange,
    calculateChange,
    addPaymentDetails,
    calculateRemainingAmount,
    multiplePayments,
    removePayment,
    updatePayment,
  } = usePaymentHandlers()

  const remainingAmount = calculateRemainingAmount()

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
          <MenuItem value="Multiple">Paiement Multiple</MenuItem>
        </Select>
      </FormControl>
      {paymentType === 'Cash' && (
        <Box>
          <TextField
            label="Montant Payé"
            value={amountPaid}
            onChange={handleAmountPaidChange}
            type="number"
            disabled={isActiveQuote}
            fullWidth
            margin="normal"
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Monnaie à rendre : {calculateChange().toFixed(2)} €
          </Typography>
        </Box>
      )}
      {paymentType === 'Multiple' && (
        <>
          <MultiplePaymentInput
            onAddPayment={addPaymentDetails}
            remainingAmount={remainingAmount}
          />
          <PaymentList
            payments={multiplePayments}
            onRemove={removePayment}
            onUpdate={(index, newPayment) => updatePayment(index, newPayment)}
          />
        </>
      )}
    </Box>
  )
}

export default PaymentTypeSelector
