import React, { useContext } from 'react'
import { Box, Typography, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { CartContext } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/priceUtils'

const OnHoldInvoices = () => {
  const { onHoldInvoices, resumeInvoice, deleteInvoice } =
    useContext(CartContext)

  return (
    <>
      {onHoldInvoices.length > 0 && (
        <Box>
          <Typography variant="h6">Factures en attente:</Typography>
          {onHoldInvoices.map((invoice, index) => {
            const adjustmentLabel =
              invoice.adjustmentAmount > 0 ? 'Majoration' : 'Remise'
            return (
              <Box
                key={index}
                sx={{ marginBottom: '8px', flexDirection: 'column' }}
              >
                <Typography sx={{ marginBottom: '4px' }}>
                  Total: {formatPrice(invoice.totalTTC)}
                  {invoice.adjustmentAmount !== 0 &&
                    ` (${adjustmentLabel}: ${formatPrice(
                      Math.abs(invoice.adjustmentAmount),
                    )})`}
                  - Facture en attente #{index + 1}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                  <Button
                    onClick={() => resumeInvoice(index)}
                    variant="contained"
                    sx={{ marginRight: '8px' }}
                  >
                    Reprendre
                  </Button>
                  <IconButton
                    onClick={() => deleteInvoice(index)}
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
