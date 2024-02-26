import React from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useInvoices } from '../../contexts/InvoicesContext'
import Barcode from 'react-barcode'

const TicketCodeGenerator = ({ ticketId }) => {
  const { tickets } = useInvoices()
  const ticket = tickets.find((ticket) => ticket._id === ticketId)

  if (!ticket) {
    return <Typography>Ticket non trouvé</Typography>
  }

  const generatePDF = async () => {
    const input = document.getElementById('printArea')
    const canvas = await html2canvas(input)
    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF({
      orientation: 'portrait',
    })

    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const scaleFactor = 0.4 // Ajustement de la taille de l'image dans le PDF
    const pdfHeight =
      ((imgProps.height * pdfWidth) / imgProps.width) * scaleFactor

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth * scaleFactor, pdfHeight)
    pdf.save(`${ticket.ticketNumber}-ticket.pdf`)
  }

  const printAreaStyle = {
    width: '640px', // 16:9 aspect ratio width
    height: '360px', // 16:9 aspect ratio height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '20px',
    margin: '20px auto',
    borderRadius: '5px',
  }

  return (
    <Box>
      <Box id="printArea" sx={printAreaStyle}>
        <Barcode
          value={ticket.ticketNumber}
          format="CODE128"
          displayValue={false}
          height={50}
          width={1}
        />
      </Box>
      <Button variant="contained" onClick={generatePDF}>
        Télécharger Ticket PDF
      </Button>
    </Box>
  )
}

export default TicketCodeGenerator
