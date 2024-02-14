// src/components/invoice/InvoicesGrid.jsx
import React, { useMemo } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { useInvoices } from '../../contexts/InvoicesContext'
import { formatPrice } from '../../utils/priceUtils' // Assurez-vous que le chemin d'importation est correct

const InvoicesGrid = () => {
  const { invoices, loading } = useInvoices()

  // Tri des factures par date, de la plus récente à la plus ancienne
  const sortedInvoices = useMemo(() => {
    return [...invoices].sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [invoices])

  // Création des lignes pour le DataGrid après tri
  const rows = sortedInvoices.map((invoice) => ({
    id: invoice._id, // Assurez-vous que '_id' est le bon identifiant
    ...invoice,
    date: new Date(invoice.date).toLocaleDateString('fr-FR'), // Formate la date pour l'affichage
    totalTTC: parseFloat(invoice.totalTTC), // Convertit totalTTC en nombre, si nécessaire
  }))

  const columns = [
    { field: 'invoiceNumber', headerName: 'Numéro de facture', width: 150 },
    { field: 'date', headerName: 'Date', width: 150 },
    {
      field: 'totalTTC',
      headerName: 'Total TTC',
      width: 130,
      valueFormatter: ({ value }) => formatPrice(value), // Utilise formatPrice pour formater le montant
    },
  ]

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        loading={loading}
        // checkboxSelection
      />
    </div>
  )
}

export default InvoicesGrid
