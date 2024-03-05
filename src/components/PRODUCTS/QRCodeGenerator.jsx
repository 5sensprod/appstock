import React from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import Barcode from 'react-barcode'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const QRCodeGenerator = ({ productId }) => {
  const { products } = useProductContextSimplified()
  const product = products.find((product) => product._id === productId)

  if (!product) {
    return <Typography>Produit non trouvé</Typography>
  }

  const gencode = product.gencode

  const generatePDF = async () => {
    const input = document.getElementById('printArea')
    const canvas = await html2canvas(input)
    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF({
      orientation: 'portrait',
    })

    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const scaleFactor = 0.4
    const pdfHeight =
      ((imgProps.height * pdfWidth) / imgProps.width) * scaleFactor

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth * scaleFactor, pdfHeight)
    pdf.save(`${product.reference}-label.pdf`)
  }

  const printAreaStyle = {
    width: '640px',
    height: '360px',
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
        <Typography variant="h5" component="h3">
          {product.reference}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Prix: {product.prixVente} €
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <QRCodeCanvas value={gencode} size={100} />
          <Barcode
            value={gencode}
            format="CODE128"
            displayValue={false}
            height={50}
            width={1}
          />
        </Box>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={generatePDF}
        sx={{ mt: 2 }}
      >
        Télécharger PDF
      </Button>
    </Box>
  )
}

export default QRCodeGenerator
