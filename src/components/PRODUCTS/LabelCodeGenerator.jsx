import React, { useState } from 'react'
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

const labelCodeGenerator = ({ productId, onOrientationChange }) => {
  const { products } = useProductContextSimplified()
  const product = products.find((product) => product._id === productId)

  const [orientation, setOrientation] = useState('landscape')

  const handleOrientationChange = (event) => {
    const newOrientation = event.target.checked ? 'landscape' : 'portrait'
    setOrientation(newOrientation)
    // Appeler la fonction du parent pour ajuster la hauteur de la modal
    onOrientationChange(newOrientation === 'landscape')
  }

  if (!product) {
    return <Typography>Produit non trouvé</Typography>
  }

  const generatePDF = async () => {
    const input = document.getElementById('printArea')
    const canvas = await html2canvas(input, { scale: 4 }) // Utiliser l'échelle 4 pour une meilleure résolution
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
        {/* Conteneur principal pour le logo et la marque */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start', // Alignés en haut
            width: '100%',
          }}
        >
          {/* Logo à gauche */}
          <Box>
            <Logo />
          </Box>

          {/* Marque entièrement à droite et alignée au centre dans son espace vertical */}
          <Typography variant="body2" mr={5}>
            {product.marque}
          </Typography>
        </Box>
        <Typography variant="h4">{product.reference}</Typography>
        <Box sx={{ width: '80%', textAlign: 'left' }}>
          {generateLines(orientation)}
        </Box>
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
      </Box>
      <Box textAlign={'center'}>
        <FormControlLabel
          control={
            <Switch
              checked={orientation === 'landscape'}
              onChange={handleOrientationChange}
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
    </Box>
  )
}

export default labelCodeGenerator
