// src/components/invoice/InvoicesGrid.jsx
import React, { useMemo } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { useInvoices } from '../../contexts/InvoicesContext'
import { formatPrice } from '../../utils/priceUtils'

const InvoicesGrid = () => {
  const { invoices, loading } = useInvoices()

  // Tri des factures par date, de la plus récente à la plus ancienne
  const sortedInvoices = useMemo(() => {
    return [...invoices].sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [invoices])

  // Création des lignes pour le DataGrid après tri
  const rows = sortedInvoices.map((invoice) => ({
    id: invoice._id,
    ...invoice,
    date: new Date(invoice.date).toLocaleDateString('fr-FR'),
    totalTTC: parseFloat(invoice.totalTTC),
  }))

  const columns = [
    { field: 'invoiceNumber', headerName: 'Numéro de facture', width: 150 },
    { field: 'date', headerName: 'Date', width: 150 },
    {
      field: 'totalTTC',
      headerName: 'Total TTC',
      width: 130,
      valueFormatter: ({ value }) => formatPrice(value),
    },
  ]

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} loading={loading} />
    </div>
  )
}

export default InvoicesGrid
