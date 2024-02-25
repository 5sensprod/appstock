import React, { useEffect, useState } from 'react'
import CustomDataGrid from '../ui/CustomDataGrid'
import { useInvoices } from '../../contexts/InvoicesContext'
import DetailsModal from '../ui/DetailsModal'

const TicketsGrid = () => {
  const { tickets, loading } = useInvoices()
  const [rows, setRows] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalRows, setModalRows] = useState([])
  const [selectedTicketId, setSelectedTicketId] = useState(null)

  const handleViewDetails = (ticketId) => {
    setSelectedTicketId(ticketId) // Stockez l'ID de la facture sélectionnée
    setIsModalOpen(true) // Ouvrez la modal
  }

  useEffect(() => {
    const formattedRows = tickets
      .map((ticket) => ({
        ...ticket,
        id: ticket._id,
        number: ticket.ticketNumber,
        date: new Date(ticket.date),
        totalTTC: ticket.totalTTC,
        onViewDetails: () => handleViewDetails(ticket._id),
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
        onViewDetails={handleViewDetails} // Assurez-vous que ceci est correct
      />
      {selectedTicketId && (
        <DetailsModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          itemId={selectedTicketId}
          itemType="ticket"
        />
      )}
    </>
  )
}

export default TicketsGrid
