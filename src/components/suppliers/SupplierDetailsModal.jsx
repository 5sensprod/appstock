import React from 'react'
import { Box, Modal, Typography, Divider } from '@mui/material'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
  outline: 'none', // Pour enlever le contour par défaut de la modale
}

const SupplierDetailsModal = ({ open, handleClose, supplier }) => {
  if (!supplier) return null

  // Gestion des champs d'adresse
  const address = [
    supplier.street,
    supplier.postalCode,
    supplier.city,
    supplier.country,
  ]
    .filter(Boolean) // Filtrer les parties d'adresse qui sont vides ou undefined
    .join(', ')

  const details = [
    { label: 'Contact', value: supplier.contact },
    { label: 'Email', value: supplier.email },
    { label: 'Téléphone', value: supplier.phone },
    { label: 'Site Web', value: supplier.website },
    { label: 'IBAN', value: supplier.iban },
    { label: 'Adresse', value: address },
    {
      label: 'Marques',
      value: (supplier.brands || [])
        .sort((a, b) => a.localeCompare(b))
        .join(', '), // Tri alphabétique des marques
    },
  ]

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography
          variant="h5"
          mb={2}
          align="center"
          sx={{ fontWeight: 'bold' }}
        >
          {supplier.name}
        </Typography>
        {supplier.supplierCode && (
          <Typography
            variant="subtitle1"
            mb={2}
            align="center"
            sx={{ fontWeight: 'bold' }}
          >
            Code fournisseur: {supplier.supplierCode}
          </Typography>
        )}
        <Divider sx={{ mb: 2 }} />

        {details
          .filter((detail) => detail.value && detail.value.trim() !== '') // Filtrer les champs vides
          .map((detail, index) => (
            <Box key={index} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {detail.label}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {detail.value}
              </Typography>
            </Box>
          ))}
      </Box>
    </Modal>
  )
}

export default SupplierDetailsModal
