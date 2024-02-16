import React, { useContext, useState, useEffect } from 'react'
import { Box, Typography, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useHoldInvoiceContext } from '../../contexts/HoldInvoiceContext'
import { CartContext } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/priceUtils'

const OnHoldInvoices = () => {
  const { onHoldInvoices, resumeInvoice, deleteInvoice } =
    useHoldInvoiceContext()
  const { setCartItems, clearCart } = useContext(CartContext)

  const handleResumeInvoice = (index) => {
    const invoice = resumeInvoice(index)
    clearCart()
    setCartItems(invoice.items)
    deleteInvoice(index)
    // Note: Assurez-vous que cette opération ne réinitialise pas les articles que vous venez de réintégrer
  }

  const handleDeleteInvoice = (index) => {
    deleteInvoice(index)
    // Afficher un message de confirmation si nécessaire
  }

  return (
    <>
      {onHoldInvoices.length > 0 && (
        <Box>
          <Typography variant="h6">Factures en attente:</Typography>
          {onHoldInvoices.map((invoice, index) => {
            return (
              <Box key={index} my={3} sx={{ flexDirection: 'column' }}>
                <Typography>
                  Total: {formatPrice(invoice.totalTTC)} - Facture en attente #
                  {index + 1}
                  {invoice.adjustmentAmount !== 0 &&
                    ` (Ajustement: ${formatPrice(Math.abs(invoice.adjustmentAmount))})`}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                  <Button
                    onClick={() => handleResumeInvoice(index)}
                    variant="contained"
                    sx={{ marginRight: '8px' }}
                  >
                    Reprendre
                  </Button>
                  <IconButton
                    onClick={() => handleDeleteInvoice(index)}
                    sx={{ marginLeft: '8px' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            )
          })}
        </Box>
      )}
    </>
  )
}

export default OnHoldInvoices
