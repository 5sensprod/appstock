// src/components/invoice/InvoicesGrid.jsx
import React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { useInvoices } from '../../contexts/InvoicesContext'

const InvoicesGrid = () => {
  const { invoices, loading } = useInvoices()

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      width: 150,
      valueGetter: (params) => {
        // Convertit la date ISO en format lisible
        return new Date(params.row.date).toLocaleDateString()
      },
    },
    {
      field: 'totalHT',
      headerName: 'Montant HT',
      type: 'number',
      width: 130,
    },
    {
      field: 'totalTTC',
      headerName: 'Montant TTC',
      type: 'number',
      width: 130,
    },
    // Ajoutez d'autres colonnes si nécessaire
  ]

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={invoices.map((invoice) => ({
          ...invoice,
          id: invoice._id, // Assurez-vous d'avoir un identifiant unique pour chaque ligne
        }))}
        columns={columns}
        pageSize={5}
        loading={loading}
        checkboxSelection
      />
    </div>
  )
}

export default InvoicesGrid
