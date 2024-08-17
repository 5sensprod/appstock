import React, { useState } from 'react'
import { Box, Button, TextField } from '@mui/material'

const BulkEditForm = ({ onSubmit, onCancel, selectedProducts }) => {
  // État pour les modifications en masse
  const [bulkData, setBulkData] = useState({
    prixVente: '',
    stock: '',
  })

  // Gère les changements dans les champs de texte
  const handleChange = (e) => {
    setBulkData({
      ...bulkData,
      [e.target.name]: e.target.value,
    })
  }

  // Gère la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault()

    // Crée un tableau de produits avec les modifications
    const updates = selectedProducts.map((productId) => ({
      id: productId,
      changes: {
        ...(bulkData.prixVente !== '' && {
          prixVente: parseFloat(bulkData.prixVente),
        }),
        ...(bulkData.stock !== '' && { stock: parseInt(bulkData.stock, 10) }),
      },
    }))

    // Appelle la fonction onSubmit avec les modifications
    onSubmit(updates)
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Prix de vente"
        name="prixVente"
        value={bulkData.prixVente}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Stock"
        name="stock"
        value={bulkData.stock}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Box mt={2} display="flex" justifyContent="space-between">
        <Button variant="contained" color="primary" type="submit">
          Appliquer
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Annuler
        </Button>
      </Box>
    </Box>
  )
}

export default BulkEditForm
