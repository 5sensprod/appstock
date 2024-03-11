import React from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material'

import { formatPrice } from '../../utils/priceUtils'
import Logo from '../ui/Logo'
import useOrientation from './hooks/useOrientation'

const labelCodeGenerator = ({ productId, onOrientationChange }) => {
  const { products } = useProductContextSimplified()
  const product = products.find((product) => product._id === productId)

  const [orientation, toggleOrientation] = useOrientation(
    'landscape',
    onOrientationChange,
  )

  if (!product) {
    return <Typography>Produit non trouvé</Typography>
  }

  const generatePDF = async () => {
    const input = document.getElementById('printArea')
    const canvas = await html2canvas(input, { scale: 4 })
    const imgData = canvas.toDataURL('image/png')

    const format = orientation === 'portrait' ? [74.25, 105] : [105, 74.25]

    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format,
    })

    pdf.addImage(imgData, 'PNG', 0, 0, format[0], format[1])
    pdf.save(`${product.reference}-etiquette.pdf`)
  }

  return (
    <Box>
      <Box
        id="printArea"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: orientation === 'portrait' ? '74.25mm' : '105mm',
          height: orientation === 'portrait' ? '105mm' : '74.25mm',
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          padding: '10px',
          margin: '20px auto',
          boxSizing: 'border-box',
        }}
      >
        <HeaderLabel product={product} />
        <Typography variant="h4" sx={{ textAlign: 'left' }}>
          {product.reference}
        </Typography>
        <Box sx={{ width: '80%', mx: 'auto', my: 2 }}>
          {generateLines(orientation)}
        </Box>
        <FooterLabel product={product} />
      </Box>
      <ControlGenerator
        orientation={orientation}
        toggleOrientation={toggleOrientation}
        generatePDF={generatePDF}
      />
    </Box>
  )
}

export default labelCodeGenerator

const generateLines = (orientation) => {
  // Déterminer le nombre de lignes basé sur l'orientation
  const linesCount = orientation === 'portrait' ? 6 : 3

  // Générer un tableau de composants <Typography>
  const lines = []
  for (let i = 0; i < linesCount; i++) {
    lines.push(
      <Typography
        key={i} // Assurez-vous d'utiliser une clé unique pour chaque élément
        variant="caption"
        component="div"
        sx={{ borderBottom: '1px dashed #cccccc' }}
      >
        &nbsp;
      </Typography>,
    )
  }
  return lines
}

const FooterLabel = ({ product }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      mt: 2,
    }}
  >
    <Typography variant="h5">{formatPrice(product.prixVente)}</Typography>
    <QRCodeCanvas value={product.gencode} size={50} />
  </Box>
)

const HeaderLabel = ({ product }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      width: '100%',
    }}
  >
    <Box>
      <Logo />
    </Box>
    <Typography variant="body2" mr={5}>
      {product.marque}
    </Typography>
  </Box>
)

const ControlGenerator = ({ orientation, toggleOrientation, generatePDF }) => (
  <Box textAlign={'center'}>
    <FormControlLabel
      control={
        <Switch
          checked={orientation === 'landscape'}
          onChange={toggleOrientation}
        />
      }
      label="Mode Paysage"
    />
    <Button
      variant="contained"
      color="primary"
      onClick={generatePDF}
      sx={{ mt: 2 }}
    >
      Générer
    </Button>
  </Box>
)
