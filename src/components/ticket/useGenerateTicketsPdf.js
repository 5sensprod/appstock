import React from 'react'
import ReactDOMServer from 'react-dom/server'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import TicketContent from './TicketContent'

const useGenerateTicketsPdf = (companyInfo) => {
  const generatePdf = async (ticket) => {
    const contentElement = document.createElement('div')
    contentElement.style.width = '200px' // Largeur fixe pour correspondre à la largeur du ticket
    document.body.appendChild(contentElement)

    contentElement.innerHTML = ReactDOMServer.renderToString(
      <TicketContent ticket={ticket} companyInfo={companyInfo} />,
    )

    html2canvas(contentElement, { scale: 2, logging: true, useCORS: true })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: 'a4',
        })

        const pdfWidth = pdf.internal.pageSize.getWidth()
        const marginLeft = (pdfWidth - 200 / (72 / 25.4)) / 2 // Convertit 300px en mm et calcule la marge gauche pour centrer

        // Utilisez la largeur fixe en mm (largeur originale du contenu en px convertie en mm)
        const imgWidthInMm = 200 / (72 / 25.4) // Convertit 300px en mm
        const imgHeightInMm =
          (canvas.height / (72 / 25.4)) *
          (imgWidthInMm / (canvas.width / (72 / 25.4))) // Convertit en mm et conserve le rapport hauteur/largeur

        pdf.addImage(imgData, 'PNG', marginLeft, 0, imgWidthInMm, imgHeightInMm)
        pdf.save(`${ticket.number}.pdf`)
        document.body.removeChild(contentElement)
      })
      .catch((error) => {
        console.error('Failed to generate ticket PDF', error)
      })
  }

  return generatePdf
}

export default useGenerateTicketsPdf
