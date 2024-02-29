import React from 'react'
import { Box, Typography } from '@mui/material'

const CustomerInfo = ({ customerInfo }) => {
  // Vérifie si les informations du client sont fournies
  if (!customerInfo) return null

  return (
    <Box
      sx={{ padding: '10px', border: '1px solid #ddd', marginBottom: '20px' }}
    >
      <Typography variant="h6" component="h3">
        Informations Client
      </Typography>
      {customerInfo.name && (
        <Typography variant="body1">Nom: {customerInfo.name}</Typography>
      )}
      {customerInfo.adress && (
        <Typography variant="body1">Adresse: {customerInfo.adress}</Typography>
      )}
      {customerInfo.email && (
        <Typography variant="body1">Email: {customerInfo.email}</Typography>
      )}
      {customerInfo.phone && (
        <Typography variant="body1">Téléphone: {customerInfo.phone}</Typography>
      )}
    </Box>
  )
}

export default CustomerInfo
