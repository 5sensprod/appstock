import React from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import Button from '@mui/material/Button'
import { Box, Typography } from '@mui/material'
import { useInvoices } from '../../contexts/InvoicesContext'
import { QRCodeCanvas } from 'qrcode.react'
import DashedLine from '../ui/DashedLine'
import HeaderCompany from '../users/HeaderCompany'
import Remerciement from '../ui/Remerciement'
import HeaderPdf from './HeaderPdf'
import PaymentType from './PaymentType'
import BodyTicket from './BodyTicket'
import TotauxTVA from './TotauxTVA'
import TotalTTC from './TotalTTC'

const TicketGenerator = ({ ticketId, onPdfGenerated }) => {
  const { tickets } = useInvoices()

  const ticket = tickets.find((ticket) => ticket._id === ticketId)

  if (!ticket) {
    return <Typography>Ticket non trouvé</Typography>
  }

  const generatePDF = async () => {
    const input = document.getElementById('printArea')

    input.style.height = 'auto'

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
    pdf.save(`${ticket.number}-ticket.pdf`)

    if (onPdfGenerated) {
      onPdfGenerated()
    }
  }

  return (
    <Box>
      <Box
        id="printArea"
        sx={{
          width: '260px',
          height: '400px',
          overflowY: 'auto',
          textAlign: 'center',
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          padding: '15px',
          margin: '20px auto',
        }}
      >
        <HeaderCompany />
        <DashedLine />
        <HeaderPdf data={ticket} title="TICKET" />
        <DashedLine />
        <BodyTicket data={ticket} />
        <DashedLine />
        <TotalTTC totalTTC={ticket.totalTTC} />
        <DashedLine />
        <TotauxTVA data={ticket} />
        <DashedLine />
        <PaymentType
          paymentType={ticket.paymentType}
          cashDetails={ticket.cashDetails}
          paymentDetails={ticket.paymentDetails}
          totalTTC={ticket.totalTTC}
        />
        <DashedLine />
        <Remerciement />
        <QRCodeCanvas value={ticket.number} size={50} />
      </Box>
      <Box textAlign={'center'}>
        <Button variant="contained" onClick={generatePDF}>
          Télécharger Ticket PDF
        </Button>
      </Box>
    </Box>
  )
}

export default TicketGenerator
