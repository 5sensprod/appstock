import React from 'react'
import { Typography, Box } from '@mui/material'
import ProductManager from '../product/ProductManager'
import Cart from '../Cart/Cart'
import { useQuotes } from '../../contexts/QuoteContext'

const POSPage = () => {
  const { isActiveQuote, activeQuoteDetails } = useQuotes()

  return (
    <Box sx={{ display: 'flex', minWidth: '900px', mt: 1 }}>
      <Box sx={{ flex: 1, minWidth: '450px', pr: 1 }}>
        <ProductManager />
      </Box>
      <Box sx={{ flex: 1, minWidth: '450px', pl: 1 }}>
        {isActiveQuote && (
          <Box mb={2}>
            <Typography variant="h6">
              Devis Actif: {activeQuoteDetails.quoteNumber}
            </Typography>
            <Typography variant="body1">
              Contact: {activeQuoteDetails.contact}
            </Typography>
          </Box>
        )}
        <Cart />
      </Box>
    </Box>
  )
}

export default POSPage
