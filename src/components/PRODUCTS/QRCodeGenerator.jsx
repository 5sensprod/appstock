import React from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { formatPrice } from '../../utils/priceUtils'
import Logo from '../ui/Logo'

const QRCodeGenerator = ({ productId }) => {
  const { products } = useProductContextSimplified()
  const product = products.find((product) => product._id === productId)

  if (!product) {
    return <Typography>Produit non trouvé</Typography>
  }

  const gencode = product.gencode

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

    // Dimensions pour l'étiquette
    const labelWidth = 105

    // Calculer le ratio de l'image pour maintenir l'aspect
    const imgRatio = canvas.height / canvas.width
    const actualLabelHeight = labelWidth * imgRatio

    // Pour aligner l'étiquette en haut à gauche
    const xPosition = 0
    const yPosition = 0

    pdf.addImage(
      imgData,
      'PNG',
      xPosition,
      yPosition,
      labelWidth,
      actualLabelHeight,
    )
    pdf.save(`${product.reference}-etiquette.pdf`)
  }

  const printAreaStyle = {
    position: 'relative',
    width: '105mm',
    height: '74.25mm',
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
    boxSizing: 'border-box',
  }

  const logoStyle = {
    position: 'absolute',
    top: '1px',
    left: '1px',
  }

  return (
    <Box>
      <Box id="printArea" sx={printAreaStyle}>
        <Box sx={logoStyle}>
          <Logo />
        </Box>
        <Typography variant="h6">{product.reference}</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          {formatPrice(product.prixVente)}
        </Typography>
        <Box>
          <QRCodeCanvas value={gencode} size={50} />
        </Box>
      </Box>
      <Box textAlign={'center'}>
        <Button
          variant="contained"
          color="primary"
          onClick={generatePDF}
          sx={{ mt: 2 }}
        >
          Générer
        </Button>
      </Box>
    </Box>
  )
}

export default QRCodeGenerator
