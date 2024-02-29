import React from 'react'
import { Box, Typography } from '@mui/material'

const CustomerInfo = ({ customerInfo }) => {
  // Style commun pour tous les éléments Typography sauf le titre
  const commonStyle = {
    fontSize: '14px', // Taille de la police pour le contenu
  }

  // Vérifie si les informations du client sont fournies
  if (!customerInfo) return null

  return (
    <Box
      sx={{ padding: '10px', border: '1px solid #ddd', marginBottom: '20px' }}
    >
      <Typography
        variant="body1"
        sx={{
          fontSize: '24px',
          fontWeight: 'bold',
        }}
      >
        Client
      </Typography>
      {customerInfo.name && (
        <Typography
          variant="body1"
          sx={{ fontSize: '14px', fontWeight: 'bold' }}
        >
          {customerInfo.name}
        </Typography>
      )}
      {customerInfo.adress && (
        <Typography variant="body1" sx={commonStyle}>
          {customerInfo.adress}
        </Typography>
      )}
      {customerInfo.email && (
        <Typography variant="body1" sx={commonStyle}>
          {customerInfo.email}
        </Typography>
      )}
      {customerInfo.phone && (
        <Typography variant="body1" sx={commonStyle}>
          {customerInfo.phone}
        </Typography>
      )}
    </Box>
  )
}

export default CustomerInfo
