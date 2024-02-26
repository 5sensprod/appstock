// src/components/ticket/useGenerateTicketsPdf.js
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import TicketContent from './TicketContent'

const useGenerateTicketsPdf = (companyInfo) => {
  // Assume companyInfo est passé ici

  const generatePdf = async (ticket) => {
    const contentElement = document.createElement('div')
    document.body.appendChild(contentElement)

    // Passer companyInfo comme props au composant
    contentElement.innerHTML = ReactDOMServer.renderToString(
      <TicketContent ticket={ticket} companyInfo={companyInfo} />,
    )

    html2canvas(contentElement)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF()
        pdf.addImage(imgData, 'PNG', 0, 0)
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
