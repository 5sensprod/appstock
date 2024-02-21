import React, { useEffect, useState } from 'react'
import CustomDataGrid from '../ui/CustomDataGrid'
import { useInvoices } from '../../contexts/InvoicesContext' // Note: This should ideally be `useTickets` if you have a separate context for tickets

const TicketsGrid = () => {
  const { tickets, loading } = useInvoices() // Note: Adjust this to use tickets data
  const [rows, setRows] = useState([])

  useEffect(() => {
    const formattedRows = tickets.map((ticket) => ({
      id: ticket._id,
      number: ticket.ticketNumber,
      date: new Date(ticket.date).toLocaleDateString('fr-FR'),
      totalTTC: ticket.totalTTC,
      // No customerName field for tickets
    }))
    setRows(formattedRows)
  }, [tickets])

  return (
    <CustomDataGrid rows={rows} loading={loading} includeCustomerName={false} />
  )
}

export default TicketsGrid
