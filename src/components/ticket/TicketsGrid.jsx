import React, { useEffect, useState } from 'react'
import CustomDataGrid from '../ui/CustomDataGrid'
import { useInvoices } from '../../contexts/InvoicesContext'

const TicketsGrid = () => {
  const { tickets, loading } = useInvoices()
  const [rows, setRows] = useState([])

  useEffect(() => {
    const formattedRows = tickets
      .map((ticket) => ({
        id: ticket._id,
        number: ticket.ticketNumber,
        date: new Date(ticket.date),
        dateString: new Date(ticket.date).toLocaleDateString('fr-FR'),
        totalTTC: ticket.totalTTC,
      }))
      .sort((a, b) => b.date - a.date)

    setRows(formattedRows.map((row) => ({ ...row, date: row.dateString })))
  }, [tickets])

  return (
    <CustomDataGrid rows={rows} loading={loading} includeCustomerName={false} />
  )
}

export default TicketsGrid
