import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { TextField, FormControl, Button } from '@mui/material'
import { useProductContext } from '../../contexts/ProductContext.js'
import { useNavigate } from 'react-router-dom'
import { useUI } from '../../contexts/UIContext.js'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const EditProductSimple = ({ productId, setInitialProductName }) => {
  const { updateProductInContext, products } = useProductContext()
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      descriptionCourte: '',
      description: '',
    },
  })
  const navigate = useNavigate()
  const { showToast } = useUI()

  useEffect(() => {
    const productToEdit = products.find((p) => p._id === productId)
    if (productToEdit) {
      setInitialProductName(productToEdit.reference)

      // Définir les valeurs initiales des champs de formulaire
      setValue('descriptionCourte', productToEdit.descriptionCourte)
      setValue('description', productToEdit.description)
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
        <p>Fiche technique</p>
        <Controller
          name="descriptionCourte"
          control={control}
          render={({ field }) => (
            <ReactQuill
              {...field}
              theme="snow"
              placeholder="Entrez la description du produit ici..."
            />
          )}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <p>Description</p>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <ReactQuill
              {...field}
              theme="snow"
              placeholder="Entrez la description du produit ici..."
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
