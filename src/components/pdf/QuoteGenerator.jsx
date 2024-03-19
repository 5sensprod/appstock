import React from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import Button from '@mui/material/Button'
import { Box, Typography } from '@mui/material'
import { useQuotes } from '../../contexts/QuoteContext'
import { QRCodeCanvas } from 'qrcode.react'
import DashedLine from '../ui/DashedLine'
import HeaderCompany from '../users/HeaderCompany'
import Remerciement from '../ui/Remerciement'
import HeaderPdf from './HeaderPdf'
import BodyTicket from './BodyTicket'
import TotauxTVA from './TotauxTVA'
import TotalTTC from './TotalTTC'
import Logo from '../ui/Logo'
import CustomerInfo from '../ui/CustomerInfo'

const QuoteGenerator = ({ quoteId, onPdfGenerated }) => {
  const { quotes } = useQuotes()

  const quote = quotes.find((quote) => quote._id === quoteId)

  if (!quote) {
    return <Typography>Devis non trouvé</Typography>
  }

  const generatePDF = async () => {
    const input = document.getElementById('printQuoteArea')
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
    const pageHeight = 297 // Hauteur de la page A4

    // Initialisation du PDF avec la première page
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

    let heightLeft = imgHeight - pageHeight
    let pageNumber = 1

    // Générer les pages suivantes si nécessaire
    while (heightLeft > 0) {
      pageNumber++
      pdf.addPage()
      pdf.addImage(
        imgData,
        'PNG',
        0,
        -(pageHeight * (pageNumber - 1)),
        imgWidth,
        imgHeight,
      )
      heightLeft -= pageHeight
    }

    // Fonction pour ajouter un pied de page sur toutes les pages
    const addFooter = () => {
      for (let i = 1; i <= pageNumber; i++) {
        pdf.setPage(i)
        pdf.setGState(new pdf.GState({ opacity: 1 }))
        pdf.setFontSize(10)
        pdf.setTextColor(0, 0, 0)
        pdf.text(
          `Devis numéro: ${quote.quoteNumber} - Page ${i} sur ${pageNumber}`,
          imgWidth - 10,
          pageHeight - 10,
          { align: 'right' },
        )
      }
    }

    addFooter()

    let fileName = `Devis_${quote.quoteNumber}.pdf`
    pdf.save(fileName)

    if (onPdfGenerated) {
      onPdfGenerated()
    }
  }

  return (
    <Box p={'10px'}>
      <Box
        id="printQuoteArea"
        sx={{
          width: '720px',
          height: 'auto',
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
        >
          <Box sx={{ width: '50%' }}>
            <HeaderPdf
              data={quote}
              title="Devis"
              titleFontSize="25px"
              numberFontSize="14px"
              dateFontSize="14px"
            />
          </Box>
          <Box sx={{ width: '50%' }}>
            <CustomerInfo customerInfo={quote.customerInfo} />
          </Box>
        </Box>

        <BodyTicket data={quote} fontSize="14px" />
        <DashedLine />
        <TotalTTC totalTTC={quote.totalTTC} fontSize="16px" />
        <DashedLine />
        <TotauxTVA data={quote} fontSize="14px" />
        <DashedLine />
        <Remerciement />
        <QRCodeCanvas value={quote.quoteNumber} size={50} />
      </Box>

      <Box textAlign={'center'} mt={2}>
        <Button variant="contained" onClick={generatePDF}>
          Télécharger Devis
        </Button>
      </Box>
    </Box>
  )
}

export default QuoteGenerator
