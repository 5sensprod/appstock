// src/components/ticket/useGenerateTicketsPdf.js
import { useContext } from 'react'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { CompanyInfoContext } from '../../contexts/CompanyInfoContext'
import { formatPrice } from '../../utils/priceUtils'

const useGenerateTicketsPdf = () => {
  const { companyInfo } = useContext(CompanyInfoContext)

  const generatePdf = async (ticket) => {
    try {
      const doc = new jsPDF()

      let currentYPosition = 10

      if (companyInfo) {
        doc.setFontSize(12)
        doc.text(companyInfo.name.toUpperCase(), 10, currentYPosition)
        currentYPosition += 5

        doc.setFontSize(10)
        doc.text(companyInfo.address, 10, currentYPosition)
        currentYPosition += 5
        doc.text(companyInfo.city, 10, currentYPosition)
        currentYPosition += 5
        doc.text(companyInfo.phone, 10, currentYPosition)
        currentYPosition += 5
        doc.text(companyInfo.email, 10, currentYPosition)
        currentYPosition += 5
        doc.text(`Tax ID: ${companyInfo.taxId}`, 10, currentYPosition)
        currentYPosition += 10
      }

      // Ajouter des informations spécifiques au ticket
      // Par exemple, numéro de ticket, date, total TTC, etc.
      doc.setFontSize(10)
      doc.text(`Ticket Number: ${ticket.number}`, 10, currentYPosition)
      currentYPosition += 5
      doc.text(`Date: ${ticket.date}`, 10, currentYPosition)
      currentYPosition += 5
      doc.text(
        `Total TTC: ${formatPrice(ticket.totalTTC)}`,
        10,
        currentYPosition,
      )
      currentYPosition += 5

      // Continuez avec plus de détails sur le ticket si nécessaire...

      //   doc.output('dataurlnewwindow')
      doc.save(`${ticket.number}.pdf`)
    } catch (error) {
      console.error('Failed to generate ticket PDF', error)
    }
  }

  return generatePdf
}

export default useGenerateTicketsPdf
