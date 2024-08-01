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
    { label: 'Nom', value: supplier.name },
    { label: 'Contact', value: supplier.contact },
    { label: 'Email', value: supplier.email },
    { label: 'Téléphone', value: supplier.phone },
    { label: 'IBAN', value: supplier.iban },
    { label: 'Adresse', value: supplier.address },
    { label: 'Marques', value: (supplier.brands || []).join(', ') },
  ]

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Détails du fournisseur
        </Typography>
        {details
          .filter((detail) => detail.value) // Filtrer les champs vides
          .map((detail, index) => (
            <Typography key={index} sx={{ mt: 2 }}>
              <strong>{detail.label}:</strong> {detail.value}
            </Typography>
          ))}
      </Box>
    </Modal>
  )
}

export default SupplierDetailsModal
