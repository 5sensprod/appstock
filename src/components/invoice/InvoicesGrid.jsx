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

  const handlePdfIconClick = (ticket) => {
    const doc = new jsPDF()

    // Ajoutez ici le code pour générer le template PDF basé sur `ticket`
    doc.text('Détails du ticket', 10, 10)
    // Utilisez `doc.autoTable` si nécessaire pour ajouter des tableaux...

    // Enfin, ouvrez le PDF dans un nouvel onglet
    doc.output('dataurlnewwindow')
  }

  useEffect(() => {
    const formattedRows = invoices
      .map((invoice) => ({
        ...invoice,
        id: invoice._id,
        number: invoice.invoiceNumber,
        date: new Date(invoice.date), // Gardez la date en tant qu'objet Date pour le tri
        dateString: new Date(invoice.date).toLocaleDateString('fr-FR'), // Ajoutez une nouvelle propriété pour l'affichage
        totalTTC: invoice.totalTTC,
        customerName: invoice.customerInfo?.name || '',
        onViewDetails: () => handleViewDetails(invoice._id),
      }))
      // Utilisez l'objet Date original pour le tri
      .sort((a, b) => b.date - a.date)
      // Après le tri, vous pouvez convertir la date en chaîne si nécessaire pour l'affichage
      .map((invoice) => ({
        ...invoice,
        date: invoice.dateString, // Utilisez la chaîne formatée pour l'affichage
      }))

    setRows(formattedRows)
  }, [invoices])

  return (
    <>
      <CustomDataGrid
        rows={rows}
        loading={loading}
        includeCustomerName={true}
        onViewDetails={handleViewDetails}
        onPdfIconClick={handlePdfIconClick}
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
