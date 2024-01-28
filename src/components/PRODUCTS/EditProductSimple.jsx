import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { TextField, FormControl, Button } from '@mui/material'
import { useProductContext } from '../../contexts/ProductContext.js'
import { useNavigate } from 'react-router-dom'
import { useUI } from '../../contexts/UIContext.js'

const EditProductSimple = ({ productId, setInitialProductName }) => {
  const { updateProductInContext, products } = useProductContext()
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      description: '',
      descriptionCourte: '',
    },
  })
  const navigate = useNavigate()
  const { showToast } = useUI()

  useEffect(() => {
    const productToEdit = products.find((p) => p._id === productId)
    if (productToEdit) {
      setInitialProductName(productToEdit.reference)

      // Définir les valeurs initiales des champs de formulaire
      setValue('description', productToEdit.description)
      setValue('descriptionCourte', productToEdit.descriptionCourte)
    }
  }, [products, productId, setValue, setInitialProductName])

  const onSubmit = async (data) => {
    try {
      await updateProductInContext(productId, data)
      navigate('/catalog')
      showToast('Produit modifié avec succès!', 'success')
    } catch (error) {
      console.error(error)
      showToast('Erreur lors de la modification du produit', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl fullWidth margin="normal">
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Description" multiline rows={4} />
          )}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <Controller
          name="descriptionCourte"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description Courte"
              multiline
              rows={2}
            />
          )}
        />
      </FormControl>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!isDirty}
      >
        Valider
      </Button>
    </form>
  )
}

export default EditProductSimple
