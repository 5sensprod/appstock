import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Checkbox, FormControlLabel, TextField, Button } from '@mui/material'
import { useProductContext } from '../../contexts/ProductContext'
import SelectCategory from '../category/SelectCategory'
import { convertToNumber } from '../../utils/formatUtils'

const BulkEditForm = ({ onSubmit }) => {
  const { fieldsToEdit, handleFieldSelect, categories, cancelBulkEdit } =
    useProductContext()
  const [selectedCategory, setSelectedCategory] = useState('')

  // Initialiser le formulaire avec des valeurs par défaut pour chaque champ
  const { control, handleSubmit } = useForm({
    defaultValues: {
      prixVente: '',
      prixAchat: '',
      stock: '',
      categorie: '',
      sousCategorie: '',
      // ... autres champs si nécessaire
    },
  })

  const handleSubmitForm = (data) => {
    // Créer un objet avec seulement les champs modifiés et convertis
    const modifiedData = Object.keys(data).reduce((acc, key) => {
      if (fieldsToEdit[key]) {
        if (key === 'prixVente' || key === 'prixAchat' || key === 'stock') {
          acc[key] = convertToNumber(data[key])
        } else {
          acc[key] = data[key]
        }
      }
      return acc
    }, {})

    onSubmit(modifiedData)
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <FormControlLabel
        control={
          <Checkbox
            checked={fieldsToEdit['prixVente'] || false}
            onChange={() => handleFieldSelect('prixVente')}
          />
        }
        label="Prix de Vente"
      />
      {fieldsToEdit['prixVente'] && (
        <Controller
          name="prixVente"
          control={control}
          render={({ field }) => <TextField type="number" {...field} />}
        />
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={fieldsToEdit['prixAchat'] || false}
            onChange={() => handleFieldSelect('prixAchat')}
          />
        }
        label="Prix d'achat"
      />
      {fieldsToEdit['prixAchat'] && (
        <Controller
          name="prixAchat"
          control={control}
          render={({ field }) => <TextField type="number" {...field} />}
        />
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={fieldsToEdit['stock'] || false}
            onChange={() => handleFieldSelect('stock')}
          />
        }
        label="Stock"
      />
      {fieldsToEdit['stock'] && (
        <Controller
          name="stock"
          control={control}
          render={({ field }) => <TextField type="number" {...field} />}
        />
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={fieldsToEdit['categorie'] || false}
            onChange={() => handleFieldSelect('categorie')}
          />
        }
        label="Catégorie"
      />
      {fieldsToEdit['categorie'] && (
        <Controller
          name="categorie"
          control={control}
          render={({ field }) => (
            <SelectCategory
              categories={categories}
              selectedCategoryId={field.value}
              onCategoryChange={(e) => {
                setSelectedCategory(e.target.value)
                field.onChange(e.target.value)
              }}
              label="Catégorie"
            />
          )}
        />
      )}

      {selectedCategory && (
        <FormControlLabel
          control={
            <Checkbox
              checked={fieldsToEdit['sousCategorie'] || false}
              onChange={() => handleFieldSelect('sousCategorie')}
            />
          }
          label="Sous-Catégorie"
        />
      )}
      {fieldsToEdit['sousCategorie'] && selectedCategory && (
        <Controller
          name="sousCategorie"
          control={control}
          render={({ field }) => (
            <SelectCategory
              categories={categories}
              selectedCategoryId={field.value}
              onCategoryChange={(e) => field.onChange(e.target.value)}
              parentFilter={selectedCategory}
              label="Sous-catégorie"
            />
          )}
        />
      )}

      <Button type="submit" variant="contained" color="primary">
        Appliquer les Modifications
      </Button>
      <Button
        type="button"
        variant="outlined"
        color="secondary"
        onClick={cancelBulkEdit}
      >
        Annuler
      </Button>
    </form>
  )
}

export default BulkEditForm
