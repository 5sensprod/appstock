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
    { label: 'IBAN', value: supplier.iban },
    { label: 'Site Web', value: supplier.website },
    {
      label: 'Adresse',
      value:
        `${supplier.street || ''}\n${supplier.postalCode || ''} ${supplier.city || ''}\n${supplier.country || ''}`.trim(),
      multiline: true,
    },
    { label: 'Marques', value: (supplier.brands || []).join(', ') },
  ]

  // Filtre les champs vides et les adresses mal formatées
  const filteredDetails = details.filter((detail) => {
    if (detail.label === 'Adresse') {
      return detail.value.trim().replace(/\n/g, ' ') !== ''
    }
    return detail.value
  })

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h5" mb={2}>
          {supplier.name}
        </Typography>
        {filteredDetails.map((detail, index) => (
          <Box key={index} sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {detail.label}
            </Typography>
            <Typography
              variant="body2"
              sx={{ whiteSpace: detail.multiline ? 'pre-line' : 'normal' }}
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
