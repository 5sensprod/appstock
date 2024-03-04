import React, { useState, useContext } from 'react'
import {
  Box,
  Grid,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Fab,
  IconButton,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import usePaymentHandlers from './usePaymentHandlers'
import { CartContext } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/priceUtils'

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
      <Typography variant="body1" color={'green'}>
        Restant à payer: {formatPrice(remainingAmount)}
      </Typography>
      <Box>
        <Grid container spacing={1} alignItems="center" mt={1}>
          <Grid item xs={12} sm={4}>
            <FormControl variant="outlined" size="small" fullWidth>
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
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Montant"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4} display="flex">
            <Fab
              color="primary"
              onClick={handleAddPayment}
              disabled={!selectedPaymentType || paymentAmount <= 0}
              size="small"
            >
              <AddIcon />
            </Fab>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

const PaymentList = ({ payments, onRemove, onUpdate }) => {
  const { editingPayment, startEditingPayment, stopEditingPayment } =
    useContext(CartContext)

  const handleEditClick = (index, amount) => {
    startEditingPayment(index, amount.toString())
  }

  const handleUpdate = (index) => {
    if (editingPayment.value) {
      const updatedPayment = {
        ...payments[index],
        amount: parseFloat(editingPayment.value),
      }
      onUpdate(index, updatedPayment)
      stopEditingPayment()
    }
  }

  return (
    <Box>
      {payments.map((payment, index) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          gap={2}
          width={'60%'}
        >
          <Box flex={1} display="flex" alignItems="center" gap={1}>
            {editingPayment.index === index ? (
              <TextField
                size="small"
                variant="outlined"
                value={editingPayment.value}
                autoFocus
                onChange={(e) => startEditingPayment(index, e.target.value)}
                type="number"
                fullWidth
              />
            ) : (
              <Typography sx={{ flexGrow: 1 }}>
                {`${payment.type}: ${formatPrice(payment.amount)}`}
              </Typography>
            )}
          </Box>
          <Box flex={1} display="flex" gap={1} justifyContent="flex-end">
            {editingPayment.index === index ? (
              <Button
                variant="contained"
                onClick={() => handleUpdate(index)}
                size="small"
              >
                Valider
              </Button>
            ) : (
              <IconButton
                onClick={() => handleEditClick(index, payment.amount)}
                size="small"
              >
                <EditIcon />
              </IconButton>
            )}
            <IconButton onClick={() => onRemove(index)} size="small">
              <DeleteIcon />
            </IconButton>
          </Box>
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
    addPaymentDetails,
    multiplePayments,
    removePayment,
    updatePayment,
  } = usePaymentHandlers()

  const { calculateRemainingAmount, calculateChange } = useContext(CartContext)

  const remainingAmount = calculateRemainingAmount()

  const change = calculateChange()
  let paymentStatusText

  if (change > 0) {
    paymentStatusText = `À rendre : ${formatPrice(change)}`
  } else if (change < 0) {
    paymentStatusText = `À payer : ${formatPrice(Math.abs(change))}`
  } else {
    paymentStatusText = 'Payé'
  }

  return (
    <Box mb={1}>
      <Box mb={2}>
        <FormControl fullWidth size="small">
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
      </Box>
      {paymentType === 'Cash' && (
        <Box mt={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <TextField
                label="Montant Payé"
                value={amountPaid.toString()}
                onChange={handleAmountPaidChange}
                type="number"
                disabled={isActiveQuote}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" color={change < 0 ? 'red' : 'green'}>
                {paymentStatusText}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}
      {paymentType === 'Multiple' && (
        <>
          <PaymentList
            payments={multiplePayments}
            onRemove={removePayment}
            onUpdate={(index, newPayment) => updatePayment(index, newPayment)}
          />
          <MultiplePaymentInput
            onAddPayment={addPaymentDetails}
            remainingAmount={remainingAmount}
          />
        </>
      )}
    </Box>
  )
}

export default PaymentTypeSelector
