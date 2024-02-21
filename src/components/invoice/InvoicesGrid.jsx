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
        date: new Date(invoice.date),
        dateString: new Date(invoice.date).toLocaleDateString('fr-FR'),
        totalTTC: invoice.totalTTC,
        customerName: invoice.customerInfo?.name || '',
      }))
      .sort((a, b) => b.date - a.date)

    setRows(formattedRows.map((row) => ({ ...row, date: row.dateString })))
  }, [invoices])

  return (
    <CustomDataGrid rows={rows} loading={loading} includeCustomerName={true} />
  )
}

export default InvoicesGrid
