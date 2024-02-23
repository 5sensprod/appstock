import React, { useEffect, useState } from 'react'
import CustomDataGrid from '../ui/CustomDataGrid'
import DetailsModal from '../ui/DetailsModal'
import { useInvoices } from '../../contexts/InvoicesContext'

const InvoicesGrid = () => {
  const { invoices, loading } = useInvoices()
  const [rows, setRows] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null)

  const handleViewDetails = (invoiceId) => {
    setSelectedInvoiceId(invoiceId)
    setIsModalOpen(true)
  }

  useEffect(() => {
    const formattedRows = invoices
      .map((invoice) => ({
        ...invoice,
        id: invoice._id,
        number: invoice.invoiceNumber,
        date: new Date(invoice.date).toLocaleDateString('fr-FR'),
        totalTTC: invoice.totalTTC,
        customerName: invoice.customerInfo?.name || '',
        onViewDetails: () => handleViewDetails(invoice._id),
      }))
      .sort((a, b) => b.date - a.date)

    setRows(formattedRows)
  }, [invoices])

  return (
    <>
      <CustomDataGrid
        rows={rows}
        loading={loading}
        includeCustomerName={true}
        onViewDetails={handleViewDetails}
      />
      {selectedInvoiceId && (
        <DetailsModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          itemId={selectedInvoiceId}
          itemType="invoice"
        />
      )}
    </>
  )
}

export default InvoicesGrid
