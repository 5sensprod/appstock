import React, { useEffect, useState } from 'react'
import CustomDataGrid from '../ui/CustomDataGrid'
import { useInvoices } from '../../contexts/InvoicesContext'
import DetailsModal from '../ui/DetailsModal'
import TicketGenerator from '../pdf/TicketGenerator'

const TicketsGrid = () => {
  const { tickets, loading, handleIncrementPdfGenerationCount } = useInvoices()
  const [rows, setRows] = useState([])
  const [selectedTicketId, setSelectedTicketId] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [generatePdf, setGeneratePdf] = useState(false)

  const handleViewDetails = (ticketId) => {
    setSelectedTicketId(ticketId)
    setIsDetailsModalOpen(true)
  }

  const handlePdfIconClick = (ticket) => {
    setSelectedTicketId(ticket.id)
    setGeneratePdf(true) // Préparez-vous à générer le PDF
  }

  useEffect(() => {
    const formattedRows = tickets
      .map((ticket) => ({
        ...ticket,
        id: ticket._id,
        number: ticket.number,
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

  return (
    <>
      <CustomDataGrid
        rows={rows}
        loading={loading}
        includeCustomerName={false}
        includeCustomerAddress={false}
        onViewDetails={handleViewDetails}
        onPdfIconClick={handlePdfIconClick}
      />
      {selectedTicketId && isDetailsModalOpen && (
        <DetailsModal
          open={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          itemId={selectedTicketId}
          itemType="ticket"
        />
      )}
      {selectedTicketId && generatePdf && (
        <TicketGenerator
          ticketId={selectedTicketId}
          onPdfGenerated={async () => {
            await handleIncrementPdfGenerationCount(selectedTicketId, 'ticket')
            setGeneratePdf(false) // Réinitialiser l'état après la génération du PDF
          }}
        />
      )}
    </>
  )
}

export default TicketsGrid
