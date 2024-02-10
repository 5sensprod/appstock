import React, { useContext } from 'react'
import { Typography, Box } from '@mui/material'

import { CartContext } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/priceUtils'

const CartTotal = () => {
  const { cartTotals, adjustmentAmount } = useContext(CartContext)

  return (
    <Box my={2}>
      <Typography variant="h5">
        Total :{' '}
        {adjustmentAmount === 0
          ? formatPrice(cartTotals.originalTotal)
          : formatPrice(cartTotals.modifiedTotal)}
      </Typography>
    </Box>
  )
}

export default CartTotal
