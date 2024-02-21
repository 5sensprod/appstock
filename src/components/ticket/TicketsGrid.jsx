// src/components/ticket/TicketsGrid.jsx
import React, { useMemo } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { useInvoices } from '../../contexts/InvoicesContext' // Utilisez useInvoices pour accéder aux tickets
import { formatPrice } from '../../utils/priceUtils'

const TicketsGrid = () => {
  const { tickets, loading } = useInvoices() // Utilisez tickets ici

  const sortedTickets = useMemo(() => {
    return [...tickets].sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [tickets])

  const rows = sortedTickets.map((ticket) => ({
    id: ticket._id,
    ...ticket,
    date: new Date(ticket.date).toLocaleDateString('fr-FR'),
    totalTTC: parseFloat(ticket.totalTTC), // Assurez-vous que vos tickets ont une propriété totalTTC ou adaptez selon votre modèle de données
  }))

  const columns = [
    { field: 'ticketNumber', headerName: 'Numéro de ticket', width: 200 },
    { field: 'date', headerName: 'Date', width: 150 },
    {
      field: 'totalTTC',
      headerName: 'Total TTC',
      width: 160,
      valueFormatter: ({ value }) => formatPrice(value),
    },
    // Ajoutez d'autres colonnes selon votre modèle de données
  ]

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} loading={loading} />
    </div>
  )
}

export default TicketsGrid
