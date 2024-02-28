import React, { useEffect, useState, useContext } from 'react'
import CustomDataGrid from '../ui/CustomDataGrid'
import { useInvoices } from '../../contexts/InvoicesContext'
import DetailsModal from '../ui/DetailsModal'
import Modal from '@mui/material/Modal'
import TicketCodeGenerator from './TicketCodeGenerator'
import { Box } from '@mui/material'

const TicketsGrid = () => {
  const { tickets, loading } = useInvoices()
  const [rows, setRows] = useState([])
  const [selectedTicketId, setSelectedTicketId] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)

  const handleViewDetails = (ticketId) => {
    setSelectedTicketId(ticketId)
    setIsDetailsModalOpen(true)
    setIsPdfModalOpen(false)
  }

  const handlePdfIconClick = (ticket) => {
    setSelectedTicketId(ticket.id)
    setIsPdfModalOpen(true)
    setIsDetailsModalOpen(false)
  }

  useEffect(() => {
    const formattedRows = tickets
      .map((ticket) => ({
        ...ticket,
        id: ticket._id,
        number: ticket.ticketNumber,
        date: new Date(ticket.date),
        totalTTC: ticket.totalTTC,
      }))
      // Tri par date en utilisant les objets Date
      .sort((a, b) => b.date - a.date)
      // Formatage de la date pour l'affichage après le tri
      .map((ticket) => ({
        ...ticket,
        date: ticket.date.toLocaleDateString('fr-FR'),
      }))

    setRows(formattedRows)
  }, [tickets])

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
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
        includeCustomerName={false}
        onViewDetails={handleViewDetails}
        onPdfIconClick={handlePdfIconClick}
      />
      {selectedTicketId && (
        <>
          {/* Modale pour les détails du ticket */}
          <DetailsModal
            open={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            itemId={selectedTicketId}
            itemType="ticket"
          />
          {/* Modale pour la génération du PDF */}
          <Modal
            open={isPdfModalOpen}
            onClose={() => setIsPdfModalOpen(false)}
            aria-labelledby="pdf-modal-title"
            aria-describedby="pdf-modal-description"
          >
            <Box sx={modalStyle}>
              <TicketCodeGenerator ticketId={selectedTicketId} />
            </Box>
          </Modal>
        </>
      )}
    </>
  )
}

export default TicketsGrid
