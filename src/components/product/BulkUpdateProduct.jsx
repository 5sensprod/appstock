import React, { useState } from 'react'
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { updateProductsBulk } from '../../api/productService'
import CustomSelect from '../ui/CustomSelect'
import { TVA_RATES } from '../../utils/constants'
import CategorySelect from '../CATEGORIES/CategorySelect'

const BulkUpdateProduct = ({ selectedProductIds, onClose }) => {
  const { register, handleSubmit, reset, control } = useForm()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const updates = Array.from(selectedProductIds).map((id) => ({
        id,
        changes: {
          ...data, // Encapsulez les champs de mise à jour dans l'objet 'changes'
        },
      }))

      await updateProductsBulk(updates)
      reset()
      onClose()
    } catch (error) {
      console.error('Erreur lors de la mise à jour en masse:', error)
      if (error.response) {
        console.error('Détails de la réponse:', error.response)
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Mise à jour en masse</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextField
            label="Prix de Vente"
            {...register('prixVente')}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Prix d'Achat"
            {...register('prixAchat')}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Stock"
            {...register('stock')}
            type="number"
            fullWidth
            margin="normal"
          />
          <Controller
            name="tva"
            control={control}
            render={({ field }) => (
              <CustomSelect label="TVA" options={TVA_RATES} {...field} />
            )}
          />
          <Controller
            name="categorie"
            control={control}
            render={({ field }) => (
              <Box mt={2} mb={1}>
                {' '}
                {/* Ajout de marges */}
                <CategorySelect
                  value={field.value}
                  onChange={(categoryId) => field.onChange(categoryId)}
                  size="medium"
                  label="Catégorie"
                />
              </Box>
            )}
          />
          <TextField
            label="Nouvelle Marque"
            {...register('marque')}
            type="text"
            fullWidth
            margin="normal"
          />
          {/* Ajoutez d'autres champs si nécessaire */}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" color="primary" disabled={loading}>
            Appliquer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default BulkUpdateProduct
