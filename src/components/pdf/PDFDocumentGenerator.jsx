import React from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import Button from '@mui/material/Button'
import { Box, Typography } from '@mui/material'
import { QRCodeCanvas } from 'qrcode.react'

const PDFDocumentGenerator = ({ itemData, qrValue, documentTitle }) => {
  // Générer le PDF
  const generatePDF = async () => {
    const input = document.getElementById('pdf-content')
    const canvas = await html2canvas(input)
    const imgData = canvas.toDataURL('image/png')

    const imgWidth = 80 // Largeur fixe en mm pour le document
    const imgHeight = canvas.height * 0.264583 // Convertir la hauteur en mm

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [imgWidth, imgHeight],
    })

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(`${documentTitle}.pdf`)
  }

  // Composants spécifiques au document
  const DocumentContent = () => (
    <>
      {/* Entête du document */}
      <Typography variant="h5" component="h1" gutterBottom>
        {documentTitle}
      </Typography>

      {/* Contenu spécifique au document */}
      {itemData &&
        itemData.map((line, index) => (
          <Typography key={index} variant="body1">
            {line}
          </Typography>
        ))}

      {/* QR Code si nécessaire */}
      {qrValue && <QRCodeCanvas value={qrValue} size={50} />}
    </>
  )

  return (
    <Box>
      <Box
        id="pdf-content"
        sx={{
          width: '260px',
          minHeight: '400px',
          backgroundColor: '#f9f9f9',
          border: '1px solid #ddd',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '15px',
          margin: '20px auto',
          borderRadius: '5px',
        }}
      >
        <DocumentContent />
      </Box>
      <Button variant="contained" onClick={generatePDF} sx={{ mt: 2 }}>
        Télécharger PDF
      </Button>
    </Box>
  )
}

export default PDFDocumentGenerator
