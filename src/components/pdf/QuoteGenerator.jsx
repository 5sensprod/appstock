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
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

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
          height: '400px',
          overflowY: 'auto',
          backgroundColor: '#fff',
          padding: '15px',
          margin: '20px auto',
        }}
      >
        {/* Ici, tu peux ajuster le contenu PDF comme tu le souhaites, en utilisant les composants importés */}
        <Logo />
        <HeaderCompany />
        <HeaderPdf data={quote} title="Devis" />
        <CustomerInfo customerInfo={quote.customerInfo} />
        <BodyTicket data={quote} />
        <TotalTTC totalTTC={quote.totalTTC} />
        <TotauxTVA data={quote} />
        <Remerciement />
        <QRCodeCanvas value={quote.quoteNumber} size={50} />
      </Box>
      <Box textAlign={'center'}>
        <Button variant="contained" onClick={generatePDF}>
          Télécharger Devis
        </Button>
      </Box>
    </Box>
  )
}

export default QuoteGenerator
