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

const InvoiceGenerator = ({ invoiceId }) => {
  const { invoices } = useInvoices()

  const invoice = invoices.find((invoice) => invoice._id === invoiceId)

  if (!invoice) {
    return <Typography>Facture non trouvée</Typography>
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
    pdf.save(`${invoice.number}-invoice.pdf`)
  }

  return (
    <Box>
      <Box
        id="printArea"
        sx={{
          width: '260px',
          minHeight: '400px',
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
          border: '1px solid #ddd',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '15px',
          margin: '20px auto',
          borderRadius: '5px',
        }}
      >
        <HeaderCompany />
        <DashedLine />
        <HeaderPdf data={invoice} title="Facture" />
        <DashedLine />
        <BodyTicket data={invoice} />
        <DashedLine />
        <TotalTTC totalTTC={invoice.totalTTC} />
        <DashedLine />
        <TotauxTVA data={invoice} />
        <DashedLine />
        <PaymentType
          paymentType={invoice.paymentType}
          cashDetails={invoice.cashDetails}
          paymentDetails={invoice.paymentDetails}
          totalTTC={invoice.totalTTC}
        />
        <DashedLine />
        <Remerciement />
        <QRCodeCanvas value={invoice.number} size={50} />
      </Box>
      <Button variant="contained" onClick={generatePDF}>
        Télécharger Facture PDF
      </Button>
    </Box>
  )
}

export default InvoiceGenerator
