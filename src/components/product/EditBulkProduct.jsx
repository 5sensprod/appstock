import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { TextField, Button, FormControl } from '@mui/material'
import { useProductContext } from '../../contexts/ProductContext'

const EditBulkProduct = () => {
  const { selectedProducts, updateProductsBulkInContext } = useProductContext()
  const { register, handleSubmit, reset } = useForm()
  const [newPrixVente, setNewPrixVente] = useState('')

  const onSubmit = async (data) => {
    const updates = Array.from(selectedProducts).map((productId) => ({
      id: productId,
      changes: { prixVente: parseFloat(data.prixVente) || 0 },
    }))

    await updateProductsBulkInContext(updates)
    reset() // Réinitialiser le formulaire après soumission
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Nouveau Prix de Vente"
          {...register('prixVente')}
          value={newPrixVente}
          onChange={(e) => setNewPrixVente(e.target.value)}
          type="number"
        />
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        Appliquer les Modifications
      </Button>
    </form>
  )
}

export default EditBulkProduct
