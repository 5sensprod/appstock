import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, TextField } from '@mui/material'
import { addProduct } from '../../api/productService'
import { capitalizeFirstLetter } from '../../utils/formatUtils'

const AddProductForm = ({ initialGencode, initialReference, onProductAdd }) => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      reference: capitalizeFirstLetter(initialReference) || '',
      prixVente: '',
      gencode: initialGencode || '',
      // Initialisez d'autres champs par défaut ici
    },
  })

  const onSubmit = async (values) => {
    try {
      // Conversion explicite de prixVente en nombre
      const formattedValues = {
        ...values,
        prixVente: parseFloat(values.prixVente) || 0, // Convertir en nombre, utiliser 0 si la conversion échoue
      }

      await addProduct(formattedValues)
      reset() // Réinitialiser le formulaire
      if (onProductAdd) {
        onProductAdd()
      }
    } catch (error) {
      // Gérer les erreurs ici
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="reference"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="text"
            placeholder="Référence"
            variant="outlined"
            fullWidth
            margin="normal"
          />
        )}
      />
      <Controller
        name="prixVente"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="number"
            placeholder="Prix de Vente"
            variant="outlined"
            fullWidth
            margin="normal"
          />
        )}
      />
      <Controller
        name="gencode"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="text"
            placeholder="Gencode"
            variant="outlined"
            fullWidth
            margin="normal"
          />
        )}
      />

      {/* Ajoutez d'autres champs ici selon vos besoins */}
      {/* ... */}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting}
        style={{ marginTop: '10px' }}
      >
        Ajouter Produit
      </Button>
    </form>
  )
}

export default AddProductForm
