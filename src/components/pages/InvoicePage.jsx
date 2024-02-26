import React from 'react'
import Typography from '@mui/material/Typography'
import InvoiceGrid from '../invoice/InvoiceGrid'
import InvoicesGrid from '../invoice/InvoicesGrid'
import TicketsGrid from '../ticket/TicketsGrid'
import { useInvoices } from '../../contexts/InvoicesContext'

const InvoicePage = () => {
  const { invoices, tickets } = useInvoices()

  return (
    <div>
      <Typography variant="h5" mb={2}>
        FACTURES
      </Typography>
      {invoices && invoices.length > 0 ? (
        <InvoicesGrid />
      ) : (
        <Typography>Aucune facture disponible.</Typography>
      )}

      <Typography variant="h5" mt={4} mb={2}>
        TICKETS
      </Typography>
      {tickets && tickets.length > 0 ? (
        <TicketsGrid />
      ) : (
        <Typography>Aucun ticket disponible.</Typography>
      )}
    </div>
  )
}

export default InvoicePage
