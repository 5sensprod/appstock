import React, { useEffect, useState } from 'react'
import CustomDataGrid from '../ui/CustomDataGrid'
import DetailsModal from '../ui/DetailsModal' // Assurez-vous d'importer DetailsModal
import { useInvoices } from '../../contexts/InvoicesContext'

const InvoicesGrid = () => {
  const { invoices, loading } = useInvoices()
  const [rows, setRows] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalRows, setModalRows] = useState([])
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null)

  const handleViewDetails = (invoiceId) => {
    setSelectedInvoiceId(invoiceId) // Stockez l'ID de la facture sélectionnée
    setIsModalOpen(true) // Ouvrez la modal
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
        onViewDetails: () => handleViewDetails(invoice._id), // Assurez-vous de passer cette fonction correctement.
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
        onViewDetails={handleViewDetails} // Assurez-vous que ceci est correct
      />
      {selectedInvoiceId && (
        <DetailsModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          invoiceId={selectedInvoiceId}
        />
      )}
    </>
  )
}

export default InvoicesGrid
