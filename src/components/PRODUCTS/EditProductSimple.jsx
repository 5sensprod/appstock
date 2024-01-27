import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { TextField, FormControl, Button } from '@mui/material'
import { useProductContext } from '../../contexts/ProductContext.js'
import { useNavigate } from 'react-router-dom'
import { useUI } from '../../contexts/UIContext.js'

const EditProductSimple = ({ productId }) => {
  const { updateProductInContext, products } = useProductContext()
  const { control, handleSubmit, setValue } = useForm()
  const [initialLoading, setInitialLoading] = useState(true)

  const navigate = useNavigate()
  const { showToast } = useUI()

  useEffect(() => {
    if (initialLoading && products.length > 0) {
      const productToEdit = products.find((p) => p._id === productId)
      if (productToEdit) {
        ;['description', 'descriptionCourte'].forEach((key) => {
          setValue(key, productToEdit[key])
        })
      }
      setInitialLoading(false)
    }
  }, [products, productId, setValue, initialLoading])

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
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Description" multiline rows={4} />
          )}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <Controller
          name="descriptionCourte"
          control={control}
          defaultValue=""
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
      <Button type="submit" variant="contained" color="primary">
        Modifier
      </Button>
    </form>
  )
}

export default EditProductSimple
