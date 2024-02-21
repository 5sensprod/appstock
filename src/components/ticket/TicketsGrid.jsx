import React, { useEffect, useState } from 'react'
import CustomDataGrid from '../ui/CustomDataGrid'
import { useInvoices } from '../../contexts/InvoicesContext' // Note: This should ideally be `useTickets` if you have a separate context for tickets

const TicketsGrid = () => {
  const { tickets, loading } = useInvoices() // Note: Adjust this to use tickets data
  const [rows, setRows] = useState([])

  useEffect(() => {
    const formattedRows = tickets
      .map((ticket) => ({
        id: ticket._id,
        number: ticket.ticketNumber,
        date: new Date(ticket.date), // Gardez la date en tant qu'objet Date pour le tri
        dateString: new Date(ticket.date).toLocaleDateString('fr-FR'), // Utilisez un champ séparé pour la chaîne de date formatée
        totalTTC: ticket.totalTTC,
      }))
      .sort((a, b) => b.date - a.date) // Triez par date décroissante

    // Mise à jour pour utiliser `dateString` pour l'affichage
    setRows(formattedRows.map((row) => ({ ...row, date: row.dateString })))
  }, [tickets])

  return (
    <CustomDataGrid rows={rows} loading={loading} includeCustomerName={false} />
  )
}

export default TicketsGrid
