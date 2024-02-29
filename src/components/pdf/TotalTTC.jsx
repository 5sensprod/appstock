import React from 'react'
import { Box, Typography } from '@mui/material'

const TotalTTC = ({ totalTTC, fontSize = '12px' }) => {
  // Convertir le total en string avec deux décimales et remplacer le point par une virgule
  const formattedTotalTTC = totalTTC.toFixed(2).replace('.', ',')

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize }}>
        Total TTC EUR
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize }}>
        {formattedTotalTTC}
      </Typography>
    </Box>
  )
}

export default TotalTTC
