// src/components/ticket/TicketContent.jsx
import React from 'react'
import { Paper, Typography, Box } from '@mui/material'

const TicketContent = ({ ticket, companyInfo }) => {
  return (
    <Paper
      elevation={3}
      sx={{ maxWidth: 300, p: 2, bgcolor: 'background.paper', margin: 'auto' }}
    >
      <Box sx={{ my: 2, textAlign: 'center' }}>
        <Typography variant="h6" component="h1" gutterBottom>
          {companyInfo?.name.toUpperCase()}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {companyInfo?.address}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {companyInfo?.city}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {companyInfo?.phone}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {companyInfo?.email}
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
        >{`Tax ID: ${companyInfo?.taxId}`}</Typography>
      </Box>

      <Box sx={{ my: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Numéro de Ticket:</strong> {ticket.number}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Date:</strong> {ticket.date}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Total TTC:</strong> {ticket.totalTTC} €
        </Typography>
        {/* Ajoutez plus de détails du ticket ici si nécessaire */}
      </Box>
    </Paper>
  )
}

export default TicketContent
