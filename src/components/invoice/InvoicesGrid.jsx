import React, { useEffect, useState } from 'react'
import CustomDataGrid from '../ui/CustomDataGrid'
import { useInvoices } from '../../contexts/InvoicesContext'

const InvoicesGrid = () => {
  const { invoices, loading } = useInvoices()
  const [rows, setRows] = useState([])

  useEffect(() => {
    const formattedRows = invoices
      .map((invoice) => ({
        id: invoice._id,
        number: invoice.invoiceNumber,
        date: new Date(invoice.date), // Gardez la date en tant qu'objet Date pour le tri
        dateString: new Date(invoice.date).toLocaleDateString('fr-FR'), // Utilisez un champ séparé pour la chaîne de date formatée
        totalTTC: invoice.totalTTC,
        customerName: invoice.customerInfo?.name || '',
      }))
      .sort((a, b) => b.date - a.date) // Triez par date décroissante

    // Mise à jour pour utiliser `dateString` pour l'affichage
    setRows(formattedRows.map((row) => ({ ...row, date: row.dateString })))
  }, [invoices])

  return (
    <CustomDataGrid rows={rows} loading={loading} includeCustomerName={true} />
  )
}

export default InvoicesGrid
