import React from 'react'
import { Grid, Typography, Box } from '@mui/material'
import ProductPOS from '../productPOS/ProductPOS'
import Cart from '../Cart/Cart'
import { useQuotes } from '../../contexts/QuoteContext'
import { useBarcodeScan } from '../../hooks/useBarcodeScan'

const POSPage = () => {
  const { isActiveQuote, activeQuoteDetails } = useQuotes()
  useBarcodeScan() // Ajout du hook de scan

  return (
    <Grid container spacing={1} mt={1}>
      <Grid item xs={12} md={6}>
        <ProductPOS />
      </Grid>
      <Grid item xs={12} md={6}>
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
      </Grid>
    </Grid>
  )
}

export default POSPage
