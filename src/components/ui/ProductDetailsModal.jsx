import React from 'react'
import { Modal, Box, Typography, TextField, Button } from '@mui/material'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400, // Vous pouvez ajuster cette valeur
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4, // Padding autour du contenu
}

const ProductDetailsModal = ({ open, onClose, product }) => {
  if (!product) return null

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h5" component="h2">
          {product.reference}
        </Typography>
        <Typography sx={{ mt: 2 }} variant="body1">
          {product.description}
        </Typography>
        {/* ... autres détails du produit ... */}
      </Box>
    </Modal>
  )
}

export default ProductDetailsModal
