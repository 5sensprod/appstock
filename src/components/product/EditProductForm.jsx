import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { TextField, Button, Box } from '@mui/material'
import SelectCategory from '../category/SelectCategory'

const EditProductForm = ({
  product,
  categories,
  onProductUpdate,
  onCancel,
}) => {
  const [selectedParentCategory, setSelectedParentCategory] = useState(
    product.categorie,
  )

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      reference: product.reference || '',
      prixVente: product.prixVente || 0,
      categorie: product.categorie || '',
      sousCategorie: product.sousCategorie || '',
      description: product.description || '',
      descriptionCourte: product.descriptionCourte || '',
      marque: product.marque || '',
      gencode: product.gencode || '',
      // Ajoutez d'autres champs au besoin
    },
  })

  const onSubmit = (values) => {
    // Convertir prixVente en nombre
    const updatedValues = {
      ...values,
      prixVente: values.prixVente ? parseFloat(values.prixVente) : 0,
    }

    const updatedProduct = { ...product, ...updatedValues }
    onProductUpdate(product._id, updatedProduct)
  }

  useEffect(() => {
    setValue('categorie', selectedParentCategory)
  }, [selectedParentCategory, setValue])

  const showSubCategorySelector = selectedParentCategory !== ''

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Controller
          name="reference"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Référence" fullWidth margin="normal" />
          )}
        />
        <Controller
          name="prixVente"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Prix de Vente"
              type="number"
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="categorie"
          control={control}
          render={({ field }) => (
            <SelectCategory
              categories={categories}
              selectedCategoryId={field.value}
              onCategoryChange={(e) => {
                setSelectedParentCategory(e.target.value)
                setValue('categorie', e.target.value)
                if (!e.target.value) {
                  setValue('sousCategorie', '')
                }
              }}
              parentFilter={null}
              label="Catégorie"
            />
          )}
        />
        {selectedParentCategory && (
          <Controller
            name="sousCategorie"
            control={control}
            render={({ field }) => (
              <SelectCategory
                categories={categories}
                selectedCategoryId={field.value}
                onCategoryChange={(e) =>
                  setValue('sousCategorie', e.target.value)
                }
                parentFilter={selectedParentCategory}
                label="Sous-catégorie"
              />
            )}
          />
        )}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              multiline
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="descriptionCourte"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description Courte"
              multiline
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="marque"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Marque" fullWidth margin="normal" />
          )}
        />
        <Controller
          name="gencode"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Gencode" fullWidth margin="normal" />
          )}
        />
        {/* Ajoutez d'autres champs ici selon vos besoins */}
      </Box>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting}
      >
        Mettre à jour
      </Button>
      <Button
        type="button"
        variant="outlined"
        color="secondary"
        onClick={onCancel}
      >
        Annuler
      </Button>
    </form>
  )
}

export default EditProductForm
