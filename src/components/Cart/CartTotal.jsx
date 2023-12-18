import React, { useState, useContext } from 'react'
import { Typography, TextField, IconButton } from '@mui/material'
import ReplayIcon from '@mui/icons-material/Replay'
import EditIcon from '@mui/icons-material/Edit'
import { CartContext } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/priceUtils'

const CartTotal = () => {
  const [adjustment, setAdjustment] = useState('')
  const [isAdjustmentValidated, setIsAdjustmentValidated] = useState(false)
  const { cartTotals, updateTotalWithAdjustment, adjustmentAmount } =
    useContext(CartContext)

  const handleAdjustmentChange = (event) => {
    setAdjustment(event.target.value)
    setIsAdjustmentValidated(false)
  }

  const handleAdjustmentConfirm = () => {
    const numericAdjustment = parseFloat(adjustment)
    if (!isNaN(numericAdjustment) && numericAdjustment !== 0) {
      updateTotalWithAdjustment(numericAdjustment)
      setIsAdjustmentValidated(true)
    } else {
      resetAdjustment() // Réinitialiser si la valeur est 0 ou non numérique
    }
  }

  const resetAdjustment = () => {
    setAdjustment('')
    updateTotalWithAdjustment(0)
    setIsAdjustmentValidated(false)
  }

  const adjustmentType =
    cartTotals.modifiedTotal > cartTotals.originalTotal
      ? 'Majoration'
      : 'Remise'

  return (
    <>
      {(isAdjustmentValidated || adjustmentAmount !== 0) && (
        <Typography variant="body2">
          Total Original: {formatPrice(cartTotals.originalTotal)}
        </Typography>
      )}

      {(isAdjustmentValidated || adjustmentAmount !== 0) && (
        <>
          <IconButton onClick={resetAdjustment} size="small">
            <ReplayIcon style={{ fontSize: 'medium' }} />
          </IconButton>
          {isAdjustmentValidated && (
            <IconButton
              onClick={() => setIsAdjustmentValidated(false)}
              size="small"
            >
              <EditIcon style={{ fontSize: 'medium' }} />
            </IconButton>
          )}

          <Typography variant="body2">
            {adjustmentAmount > 0 ? 'Majoration: ' : 'Remise: '}
            {formatPrice(Math.abs(adjustmentAmount))}
          </Typography>
        </>
      )}

      {!isAdjustmentValidated && (
        <TextField
          label="Remise/Majoration"
          value={adjustment}
          onChange={handleAdjustmentChange}
          onBlur={handleAdjustmentConfirm}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAdjustmentConfirm()
            }
          }}
          size="small"
        />
      )}

      <Typography variant="h6">
        Total :{' '}
        {adjustmentAmount === 0
          ? formatPrice(cartTotals.originalTotal)
          : formatPrice(cartTotals.modifiedTotal)}
      </Typography>
    </>
  )
}

export default CartTotal
