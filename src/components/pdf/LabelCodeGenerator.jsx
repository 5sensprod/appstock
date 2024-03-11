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
import useOrientation from './hooks/useOrientation'

const labelCodeGenerator = ({ productId, onOrientationChange }) => {
  const { products } = useProductContextSimplified()
  const product = products.find((product) => product._id === productId)
  const [labelsCount, setLabelsCount] = useState(1)

  const [orientation, toggleOrientation] = useOrientation(
    'portrait',
    onOrientationChange,
  )

  if (!product) {
    return <Typography>Produit non trouvé</Typography>
  }

  const generatePDF = async () => {
    const input = document.getElementById('printArea')
    const canvas = await html2canvas(input, { scale: 4 })
    const imgData = canvas.toDataURL('image/png')

    // Format pour une seule étiquette
    const singleLabelFormat = [74.25, 105]

    // Créez un nouveau PDF en mode paysage, qui peut contenir 8 étiquettes
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    })

    // Calcul des positions où les étiquettes doivent être placées sur la page
    const positions = generateLabelPositions()

    // Ajout de chaque étiquette à la page
    positions.forEach((position) => {
      pdf.addImage(
        imgData,
        'PNG',
        position.x,
        position.y,
        singleLabelFormat[0],
        singleLabelFormat[1],
      )
    })

    // Enregistrez le PDF
    pdf.save(`${product.reference}-etiquettes.pdf`)
  }

  return (
    <Box>
      <ControlGenerator
        orientation={orientation}
        toggleOrientation={toggleOrientation}
        generatePDF={generatePDF}
      />
      <Box
        sx={{
          mb: orientation === 'landscape' ? 5 : -5,
        }}
      >
        <Sheet labelsCount={labelsCount} orientation={orientation} />
      </Box>
      <Box
        id="printArea"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: orientation === 'portrait' ? '74.25mm' : '105mm',
          height: orientation === 'portrait' ? '105mm' : '74.25mm',
          transform: orientation === 'landscape' ? 'rotate(-90deg)' : 'none',
          // transformOrigin: 'center center',
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
        key={i}
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
  <Box textAlign={'center'} mb={4}>
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

const Sheet = ({ labelsCount, orientation }) => {
  const pageDimensions = { width: 210, height: 297 }
  const labelDimensions = { width: 74.25, height: 105 }
  const [cellStates, setCellStates] = useState(
    [{ present: true, orientation: 'portrait', copies: 1, clicks: 0 }].concat(
      Array(7).fill({
        present: false,
        orientation: 'portrait',
        copies: 1,
        clicks: 0,
      }),
    ),
  )

  const handleCellClick = (index) => {
    setCellStates(
      cellStates.map((cell, idx) => {
        if (idx === index) {
          const newClicks = cell.clicks + 1
          let newState = {}
          if (newClicks === 1) {
            // Premier clic, activer si pas déjà activé
            newState = { ...cell, present: true, clicks: newClicks }
          } else if (newClicks === 2) {
            // Deuxième clic, rotation de 90°
            newState = { ...cell, clicks: newClicks }
          } else {
            // Troisième clic, désactiver la cellule
            newState = {
              present: false,
              orientation: 'portrait',
              copies: 1,
              clicks: 0,
            }
          }
          return newState
        }
        return cell
      }),
    )
  }

  const baseWidthPx = 50

  // Longueur cible en pixels pour le côté de 210mm

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(4, 1fr)`,
    gap: '1px',
    padding: '1px',
    border: '1px solid #ddd',
    backgroundColor: '#f0f0f0',
    // Largeur et hauteur fixes basées sur le mode paysage
    width: `${baseWidthPx * (pageDimensions.height / pageDimensions.width)}px`,
    height: `${baseWidthPx}px`,
  }

  const cellNumberStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    // Retirez la rotation pour le mode portrait et appliquez-la pour le mode paysage
    transform:
      orientation === 'portrait'
        ? 'translate(-50%, -50%)'
        : 'translate(-50%, -50%) rotate(-90deg)',
    width: 'max-content',
    height: 'max-content',
    fontFamily: 'Arial, sans-serif',
    fontSize: '12px',
    pointerEvents: 'none',
  }

  return (
    <Box sx={gridStyle}>
      {cellStates.map((cell, index) => (
        <Box
          key={index}
          onClick={() => handleCellClick(index)}
          sx={{
            width: '100%',
            height: 0,
            paddingTop: `${(labelDimensions.height / labelDimensions.width) * 100}%`,
            position: 'relative',
            backgroundColor: cell.present ? '#ddd' : 'transparent',
            border: '1px solid black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          {cell.present && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${cell.clicks === 2 ? -90 : 0}deg)`,
                pointerEvents: 'auto', // Permettre les clics sur ce div et ses enfants
              }}
            >
              <span style={cellNumberStyle}>{index + 1}</span>
            </div>
          )}
        </Box>
      ))}
    </Box>
  )
}

const generateLabelPositions = () => {
  const positions = []
  const labelsPerRow = 4 // Nombre d'étiquettes par rangée
  const rowHeight = 105 // Hauteur d'une rangée
  const labelWidth = 74.25 // Largeur d'une étiquette

  for (let i = 0; i < 8; i++) {
    // Pour 8 étiquettes
    const x = (i % labelsPerRow) * labelWidth
    const y = Math.floor(i / labelsPerRow) * rowHeight
    positions.push({ x, y })
  }

  return positions
}
