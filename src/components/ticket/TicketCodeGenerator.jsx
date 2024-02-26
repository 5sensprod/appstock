import React, { useContext } from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Typography, Divider } from '@mui/material'
import { useInvoices } from '../../contexts/InvoicesContext'
// import Barcode from 'react-barcode'
import { QRCodeCanvas } from 'qrcode.react'
import { CompanyInfoContext } from '../../contexts/CompanyInfoContext'

const TicketCodeGenerator = ({ ticketId }) => {
  const { tickets } = useInvoices()
  const { companyInfo } = useContext(CompanyInfoContext)

  const ticket = tickets.find((ticket) => ticket._id === ticketId)

  if (!ticket) {
    return <Typography>Ticket non trouvé</Typography>
  }

  const generatePDF = async () => {
    const input = document.getElementById('printArea')
    const canvas = await html2canvas(input)
    const imgData = canvas.toDataURL('image/png')

    const imgWidth = 80 // Largeur fixe en mm pour un ticket de caisse
    // Calculer la nouvelle hauteur basée sur le ratio de l'image
    const imgHeight = canvas.height * 0.264583 // Convertir la hauteur en mm (1px = 0.264583 mm)

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [imgWidth, imgHeight],
    })

    // Assurez-vous que la largeur et la hauteur de l'image ajoutée correspondent au format du PDF
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(`${ticket.ticketNumber}-ticket.pdf`)
  }

  const printAreaStyle = {
    width: '260px',
    minHeight: '400px',
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '15px',
    margin: '20px auto',
    borderRadius: '5px',
  }

  const dividerStyle = {
    margin: '8px 0',
    border: '2px',
    borderBottom: '1px solid #000',
    opacity: 1, // Assurez-vous que l'élément n'est pas transparent
    visibility: 'visible', // Force la visibilité de l'élément
  }

  return (
    <Box>
      <Box id="printArea" sx={printAreaStyle}>
        <Typography
          component="p"
          style={{ marginBottom: '1px', fontWeight: 'bold', fontSize: '12px' }}
        >
          {companyInfo?.name.toUpperCase()}
        </Typography>
        <Typography component="p" style={{ fontSize: '10px' }}>
          {companyInfo?.address}
        </Typography>
        <Typography component="p" style={{ fontSize: '10px' }}>
          {companyInfo?.city}
        </Typography>
        <Typography component="p" style={{ fontSize: '10px' }}>
          {companyInfo?.phone}
        </Typography>
        <Typography component="p" style={{ fontSize: '10px' }}>
          {companyInfo?.email}
        </Typography>
        <Typography
          component="p"
          style={{ fontSize: '10px' }}
        >{`Tax ID: ${companyInfo?.taxId}`}</Typography>
        <hr style={dividerStyle} />
        <QRCodeCanvas value={ticket.ticketNumber} size={50} />
      </Box>
      <Button variant="contained" onClick={generatePDF}>
        Télécharger Ticket PDF
      </Button>
    </Box>
  )
}

export default TicketCodeGenerator
