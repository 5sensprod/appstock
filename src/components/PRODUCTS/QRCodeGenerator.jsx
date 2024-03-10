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

  const generatePDF = async () => {
    const input = document.getElementById('printArea')
    const canvas = await html2canvas(input, { scale: 4 }) // Utiliser l'échelle 4 pour une meilleure résolution
    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF({
      orientation: 'landscape', // Utiliser le mode paysage pour correspondre aux dimensions
      unit: 'mm',
      format: [105, 74.25], // Format personnalisé pour la taille de la page
    })

    pdf.addImage(imgData, 'PNG', 0, 0, 105, 74.25)
    pdf.save(`${product.reference}-etiquette.pdf`)
  }

  return (
    <Box>
      <Box
        id="printArea"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between', // Permet de positionner le QR code en bas
          width: '105mm',
          height: '74.25mm',
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          padding: '10px',
          margin: '20px auto',
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ alignSelf: 'flex-start' }}>
          <Logo />
        </Box>
        <Typography variant="h4">{product.reference}</Typography>
        <Box sx={{ width: '80%', textAlign: 'left' }}>
          <Typography
            variant="caption"
            component="div"
            sx={{ borderBottom: '1px dashed #cccccc' }}
          >
            &nbsp;
          </Typography>
          <Typography
            variant="caption"
            component="div"
            sx={{ borderBottom: '1px dashed #cccccc' }}
          >
            &nbsp;
          </Typography>
          <Typography
            variant="caption"
            component="div"
            sx={{ borderBottom: '1px dashed #cccccc' }}
          >
            &nbsp;
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ mt: 2 }}>
          {formatPrice(product.prixVente)}
        </Typography>
        <Box sx={{ alignSelf: 'flex-end' }}>
          <QRCodeCanvas value={product.gencode} size={50} />
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
