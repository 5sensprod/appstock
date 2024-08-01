import React from 'react'
import { Box, Modal, Typography } from '@mui/material'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const SupplierDetailsModal = ({ open, handleClose, supplier }) => {
  if (!supplier) return null

  const details = [
    { label: 'Contact', value: supplier.contact },
    { label: 'Email', value: supplier.email },
    { label: 'Téléphone', value: supplier.phone },
    { label: 'Site Web', value: supplier.website },
    { label: 'IBAN', value: supplier.iban },
    {
      label: 'Adresse',
      value: `${supplier.street}\n${supplier.postalCode} ${supplier.city}\n${supplier.country}`,
      multiline: true,
    },
    { label: 'Marques', value: (supplier.brands || []).join(', ') },
  ]

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h5" mb={2}>
          {supplier.name}
        </Typography>
        <Typography variant="subtitle1" mb={2}>
          Code fournisseur: {supplier.supplierCode}
        </Typography>
        {details
          .filter((detail) => detail.value) // Filtrer les champs vides
          .map((detail, index) => (
            <Box key={index} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" component="div">
                {detail.label}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: detail.multiline ? 'pre-line' : 'normal',
                }}
              >
                {detail.value}
              </Typography>
            </Box>
          ))}
      </Box>
    </Modal>
  )
}

export default SupplierDetailsModal
