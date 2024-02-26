import React from 'react'
import { Typography, Divider } from '@mui/material'

const TicketContent = ({ ticket, companyInfo }) => {
  const rootId = `ticketContent-${ticket.number}`
  return (
    <div
      id={rootId}
      style={{
        maxWidth: '200px',
        backgroundColor: '#fff',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '8px',
        boxShadow:
          '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)', // Simule elevation={3}
      }}
    >
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          marginTop: '5px',
          marginBottom: '1px',
          border: '1px solid #ddd',
          //   borderRadius: '4px',
          padding: '5px',
        }}
      >
        <Typography
          component="p"
          style={{ marginBottom: '1px', fontWeight: 'bold', fontSize: '12px' }}
        >
          {companyInfo?.name.toUpperCase()}
        </Typography>
        <Typography component="p" style={{ fontSize: '10px' }}>
          {companyInfo?.address}
        </Typography>
        <Typography component="p" style={{ fontSize: '10px' }}>
          {companyInfo?.city}
        </Typography>
        <Typography component="p" style={{ fontSize: '10px' }}>
          {companyInfo?.phone}
        </Typography>
        <Typography component="p" style={{ fontSize: '10px' }}>
          {companyInfo?.email}
        </Typography>
        <Typography
          component="p"
          style={{ fontSize: '10px' }}
        >{`Tax ID: ${companyInfo?.taxId}`}</Typography>
        <Divider style={{ margin: '8px 0' }} />
        <div style={{ width: '100%' }}>
          <Typography
            component="p"
            style={{ fontWeight: 'bold', marginBottom: '8px' }}
          >
            <strong>Numéro de Ticket:</strong> {ticket.number}
          </Typography>
          <Typography
            component="p"
            style={{ fontWeight: 'bold', marginBottom: '8px' }}
          >
            <strong>Date:</strong> {ticket.date}
          </Typography>
          <Typography
            component="p"
            style={{ fontWeight: 'bold', marginBottom: '8px' }}
          >
            <strong>Total TTC:</strong> {ticket.totalTTC} €
          </Typography>
          {/* Vous pouvez ajouter plus de détails ici si nécessaire */}
        </div>
      </div>
    </div>
  )
}

export default TicketContent
