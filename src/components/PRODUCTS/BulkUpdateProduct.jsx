import React, { useState, useContext } from 'react'
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
import CustomSelect from '../ui/CustomSelect'
import { TVA_RATES } from '../../utils/constants'
import CategorySelect from '../CATEGORIES/CategorySelect'
import { useUI } from '../../contexts/UIContext'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'

const BulkUpdateProduct = ({ selectedProductIds, onClose }) => {
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      tva: null,
    },
  })
  const [loading, setLoading] = useState(false)

  const { bulkUpdateProductsInContext } = useProductContextSimplified()
  const { showToast } = useUI()

  const onSubmit = async (data) => {
    setLoading(true)

    // Conversion des valeurs en nombres
    const formattedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== '') {
        acc[key] = ['prixVente', 'prixAchat', 'stock'].includes(key)
          ? parseFloat(value) || 0
          : value
      }
      return acc
    }, {})

    const filteredData = Object.entries(formattedData).reduce(
      (acc, [key, value]) => {
        if (value !== '' && value != null) {
          acc[key] = value
        }
        return acc
      },
      {},
    )

    try {
      const updates = Array.from(selectedProductIds).map((id) => ({
        id,
        changes: filteredData, // Utilise les données formatées
      }))

      await bulkUpdateProductsInContext(updates)
      showToast('Mise à jour en masse réussie.', 'success')
      reset()
      onClose()
    } catch (error) {
      showToast('Erreur lors de la mise à jour en masse.', 'error')
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
              <CustomSelect
                label="TVA"
                options={TVA_RATES}
                {...field}
                value={field.value || ''}
              />
            )}
          />
          <Controller
            name="categorie"
            control={control}
            render={({ field }) => (
              <Box mt={2} mb={1}>
                <CategorySelect
                  value={field.value || ''}
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
