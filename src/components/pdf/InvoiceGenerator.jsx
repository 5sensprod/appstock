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
import Logo from '../ui/Logo'
import CustomerInfo from '../ui/CustomerInfo'

const InvoiceGenerator = ({ invoiceId, onPdfGenerated }) => {
  const { invoices } = useInvoices()

  const invoice = invoices.find((invoice) => invoice._id === invoiceId)

  if (!invoice) {
    return <Typography>Facture non trouvée</Typography>
  }

  const generatePDF = async () => {
    const input = document.getElementById('printArea')
    input.style.height = 'auto'

    const canvas = await html2canvas(input)
    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const imgWidth = 210 // Largeur de la page A4
    const imgHeight = (canvas.height * imgWidth) / canvas.width // Calculer la hauteur tout en conservant le ratio
    let heightLeft = imgHeight

    const pageHeight = 297 // Hauteur de la page A4
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight // Mettre à jour la position pour la prochaine partie de l'image
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(`${invoice.number}-invoice.pdf`)

    if (onPdfGenerated) {
      onPdfGenerated()
    }
  }

  return (
    <Box p={'10px'}>
      <Box
        id="printArea"
        sx={{
          width: '720px',
          height: '400px',
          overflowY: 'auto',
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          padding: '15px',
          margin: '20px auto',
        }}
      >
        <Box
          mb={2}
          sx={{
            display: 'flex',
            alignItems: 'start',
            justifyContent: 'space-between',
          }}
        >
          <HeaderCompany
            styles={{
              title: { fontSize: '15px', fontWeight: 'bold' },
              body: { fontSize: '12px', fontWeight: 'normal' },
              taxId: { fontSize: '12px', fontWeight: 'bold' },
              rcs: { fontSize: '10px', fontWeight: 'normal' },
            }}
            visibleFields={{
              title: true,
              body: true,
              taxId: true,
              rcs: true,
            }}
          />
          <Logo />
        </Box>
        {/* <DashedLine /> */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '50%',
            }}
          >
            <HeaderPdf
              data={invoice}
              title="Facture"
              titleFontSize="25px"
              numberFontSize="14px"
              dateFontSize="14px"
            />
          </Box>
          <Box
            sx={{
              width: '50%',
            }}
          >
            <CustomerInfo customerInfo={invoice.customerInfo} />
          </Box>
        </Box>
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
      <Box textAlign={'center'}>
        <Button variant="contained" onClick={generatePDF}>
          Télécharger Facture
        </Button>
      </Box>
    </Box>
  )
}

export default InvoiceGenerator
