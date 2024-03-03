import React, { useEffect, useState } from 'react'
import CustomDataGrid from '../ui/CustomDataGrid'
import { useInvoices } from '../../contexts/InvoicesContext'
import DetailsModal from '../ui/DetailsModal'
import Modal from '@mui/material/Modal'
import InvoiceGenerator from '../pdf/InvoiceGenerator'
import { Box } from '@mui/material'

const InvoicesGrid = () => {
  const { invoices, loading, handleIncrementPdfGenerationCount } = useInvoices()
  const [rows, setRows] = useState([])
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)

  const handleViewDetails = (invoiceId) => {
    setSelectedInvoiceId(invoiceId)
    setIsDetailsModalOpen(true)
    setIsPdfModalOpen(false)
  }

  const handlePdfIconClick = (invoice) => {
    setSelectedInvoiceId(invoice.id)
    setIsPdfModalOpen(true)
    setIsDetailsModalOpen(false)
  }

  useEffect(() => {
    const formattedRows = invoices
      .map((invoice) => ({
        ...invoice,
        id: invoice._id,
        number: invoice.number,
        date: new Date(invoice.date),
        dateString: new Date(invoice.date).toLocaleDateString('fr-FR'),
        totalTTC: invoice.totalTTC,
        customerName: invoice.customerInfo?.name || '',
        customerAddress: invoice.customerInfo?.adress || '',
        onViewDetails: () => handleViewDetails(invoice._id),
      }))
      // Utilisez l'objet Date original pour le tri
      .sort((a, b) => b.date - a.date)
      // Après le tri, vous pouvez convertir la date en chaîne si nécessaire pour l'affichage
      .map((invoice) => ({
        ...invoice,
        date: invoice.dateString,
      }))

    setRows(formattedRows)
  }, [invoices])

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 790,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

  return (
    <>
      <CustomDataGrid
        rows={rows}
        loading={loading}
        includeCustomerName={true}
        includeCustomerAddress={true}
        onViewDetails={handleViewDetails}
        onPdfIconClick={handlePdfIconClick}
      />
      {selectedInvoiceId && (
        <>
          <DetailsModal
            open={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            itemId={selectedInvoiceId}
            itemType="invoice"
          />
          {/* Modale pour la génération du PDF */}
          <Modal
            open={isPdfModalOpen}
            onClose={() => setIsPdfModalOpen(false)}
            aria-labelledby="pdf-modal-title"
            aria-describedby="pdf-modal-description"
          >
            <Box sx={modalStyle}>
              <InvoiceGenerator
                invoiceId={selectedInvoiceId}
                onPdfGenerated={async () => {
                  await handleIncrementPdfGenerationCount(selectedInvoiceId)
                  setIsPdfModalOpen(false)
                }}
              />
            </Box>
          </Modal>
        </>
      )}
    </>
  )
}

export default InvoicesGrid
