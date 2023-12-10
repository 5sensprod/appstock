import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, TextField } from '@mui/material'
import { addProduct } from '../../api/productService'
import { capitalizeFirstLetter } from '../../utils/formatUtils'
import { useProductContext } from '../../contexts/ProductContext'

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

  const { setIsAddingProduct } = useProductContext()

  useEffect(() => {
    setIsAddingProduct(true)
    return () => setIsAddingProduct(false)
  }, [setIsAddingProduct])

  const onSubmit = async (values) => {
    // Convertir prixVente en nombre
    const updatedValues = {
      ...values,
      prixVente: values.prixVente ? parseFloat(values.prixVente) : 0,
    }

    try {
      await addProduct(updatedValues)
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
