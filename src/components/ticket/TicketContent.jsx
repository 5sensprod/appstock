// src/components/ticket/TicketContent.jsx
import React from 'react'
import { Paper, Typography, Box, Divider } from '@mui/material'

const TicketContent = ({ ticket, companyInfo }) => {
  const rootId = `ticketContent-${ticket.number}`
  return (
    <Paper
      elevation={3}
      id={rootId}
      sx={{
        maxWidth: 200,
        p: 2,
        bgcolor: 'background.paper',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '10pt',
      }}
    >
      <Box
        sx={{
          width: '100%',
          textAlign: 'center',
          '& > *': { marginBottom: '1px' },
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '20px',
        }}
      >
        <Typography variant="body1">
          {companyInfo?.name.toUpperCase()}
        </Typography>
        <Typography variant="body2">{companyInfo?.address}</Typography>
        <Typography variant="body2">{companyInfo?.city}</Typography>
        <Typography variant="body2">{companyInfo?.phone}</Typography>
        <Typography variant="body2">{companyInfo?.email}</Typography>
        <Typography variant="body2">{`Tax ID: ${companyInfo?.taxId}`}</Typography>
        <Divider sx={{ my: 1 }} /> {/* Ajoute un petit trait sous l'en-tête */}
      </Box>

      {/* Détails du ticket, après le trait */}
      <Box sx={{ width: '100%' }}>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Numéro de Ticket:</strong> {ticket.number}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Date:</strong> {ticket.date}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Total TTC:</strong> {ticket.totalTTC} €
        </Typography>
        {/* Vous pouvez ajouter plus de détails ici si nécessaire */}
      </Box>
    </Paper>
  )
}

export default TicketContent
