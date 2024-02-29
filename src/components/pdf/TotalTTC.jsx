import React from 'react'
import { Box, Typography } from '@mui/material'

const TotalTTC = ({ totalTTC }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
        Total TTC EUR
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
        {totalTTC.toFixed(2)}
      </Typography>
    </Box>
  )
}

export default TotalTTC
