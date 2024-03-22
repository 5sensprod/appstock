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
  const [mode, setMode] = useState('save')

  const handleViewDetails = (ticketId) => {
    setSelectedTicketId(ticketId)
    setIsDetailsModalOpen(true)
  }

  const handlePdfIconClick = (ticket) => {
    setSelectedTicketId(ticket.id)
    setMode('save')
  }

  const handlePrintClick = (ticket) => {
    setSelectedTicketId(ticket.id)
    setMode('print')
  }

  const saveBlobAsFile = (blob, fileName) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
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
        onPdfIconClick={(ticket) => handlePdfIconClick(ticket, 'save')} // Déjà là
        onPrintIconClick={handlePrintClick}
      />
      {selectedTicketId && isDetailsModalOpen && (
        <DetailsModal
          open={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          itemId={selectedTicketId}
          itemType="ticket"
        />
      )}
      {selectedTicketId && mode && (
        <TicketGenerator
          ticketId={selectedTicketId}
          onPdfGenerated={async (blob, number, generationCount) => {
            if (mode === 'print') {
              // Ouvrir le blob PDF dans un nouvel onglet pour l'impression
              const pdfUrl = URL.createObjectURL(blob)
              window.open(pdfUrl, '_blank')
            } else if (mode === 'save') {
              // Sauvegarde le PDF localement
              const fileName = `${number}${generationCount > 0 ? `-duplicata${generationCount}` : ''}.pdf`
              saveBlobAsFile(blob, fileName)
            }

            // Après avoir traité le PDF, incrémentez le compteur de génération de PDF
            await handleIncrementPdfGenerationCount(selectedTicketId, 'ticket')

            setMode(null) // Réinitialisez le mode après l'action pour éviter des actions répétitives non désirées
          }}
        />
      )}
    </>
  )
}

export default TicketsGrid
