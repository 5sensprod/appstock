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
    const imgHeight = (canvas.height * imgWidth) / canvas.width // Hauteur basée sur le ratio de l'image
    let position = 0

    let heightLeft = imgHeight
    const pageHeight = 297 // Hauteur de la page A4

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    let pageNumber = 1
    let totalPages = Math.ceil(imgHeight / pageHeight)

    // Ajout du pied de page pour chaque page
    while (heightLeft >= 0) {
      pageNumber++
      pdf.addPage()
      position = heightLeft - imgHeight
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Fonction pour ajouter un pied de page sur toutes les pages
    const addFooter = () => {
      for (let i = 1; i <= pageNumber; i++) {
        pdf.setPage(i)
        pdf.setFontSize(10)
        pdf.text(
          `${invoice.number} - Page ${i}/${totalPages}`,
          imgWidth - 20,
          pageHeight - 10,
          'right',
        )
      }
    }

    addFooter()

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

        <Box
          my={4}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            width: '100%',
          }}
          mb={2}
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
        <Box p={2}>
          <DashedLine />
          <BodyTicket data={invoice} fontSize="14px" />
          <DashedLine />
          <Box>
            <TotalTTC totalTTC={invoice.totalTTC} fontSize="16px" />
          </Box>
          <DashedLine />
          <Box mt={4}>
            <TotauxTVA data={invoice} fontSize="14px" />
          </Box>
          <DashedLine />{' '}
          <Box my={4}>
            <PaymentType
              paymentType={invoice.paymentType}
              cashDetails={invoice.cashDetails}
              paymentDetails={invoice.paymentDetails}
              totalTTC={invoice.totalTTC}
              fontSize="14px"
            />
          </Box>
        </Box>

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
