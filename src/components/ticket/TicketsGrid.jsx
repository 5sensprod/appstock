import React, { useEffect, useState, useContext } from 'react'
import CustomDataGrid from '../ui/CustomDataGrid'
import { useInvoices } from '../../contexts/InvoicesContext'
import DetailsModal from '../ui/DetailsModal'
import useGenerateTicketsPdf from './useGenerateTicketsPdf'
import { CompanyInfoContext } from '../../contexts/CompanyInfoContext'

const TicketsGrid = () => {
  const { tickets, loading } = useInvoices()
  const [rows, setRows] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTicketId, setSelectedTicketId] = useState(null)
  const { companyInfo } = useContext(CompanyInfoContext)
  const generateTicketsPdf = useGenerateTicketsPdf(companyInfo)

  const handleViewDetails = (ticketId) => {
    setSelectedTicketId(ticketId)
    setIsModalOpen(true)
  }

  const handlePdfIconClick = (ticket) => {
    generateTicketsPdf(ticket)
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
        onViewDetails={handleViewDetails}
        onPdfIconClick={handlePdfIconClick}
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
