import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { TextField, Button, FormControl } from '@mui/material'
import { useProductContext } from '../../contexts/ProductContext'
import SelectCategory from '../category/SelectCategory'

function CreateCategory() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm()
  const { addCategory, categories } = useProductContext()

  const onSubmit = async (data) => {
    try {
      await addCategory(data)
      reset() // Réinitialiser le formulaire après l'envoi
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register('name', { required: 'Nom de la catégorie requis' })}
          label="Nom de la catégorie"
          error={!!errors.name}
          helperText={errors.name ? errors.name.message : null}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <Controller
          name="parentId"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <SelectCategory
              categories={categories}
              selectedCategoryId={field.value}
              onCategoryChange={(e) => field.onChange(e.target.value)}
              label="Catégorie Parente"
            />
          )}
        />
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        Ajouter la catégorie
      </Button>
    </form>
  )
}

export default CreateCategory
