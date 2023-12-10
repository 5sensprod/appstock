import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Checkbox, FormControlLabel, TextField, Button } from '@mui/material'
import { useProductContext } from '../../contexts/ProductContext'
import SelectCategory from '../category/SelectCategory'

const BulkEditForm = ({ onSubmit }) => {
  const { fieldsToEdit, handleFieldSelect, categories, cancelBulkEdit } =
    useProductContext()
  const { control, handleSubmit } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
              onCategoryChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={fieldsToEdit['sousCategorie'] || false}
            onChange={() => handleFieldSelect('sousCategorie')}
          />
        }
        label="Sous-Catégorie"
      />
      {fieldsToEdit['sousCategorie'] && (
        <Controller
          name="sousCategorie"
          control={control}
          render={({ field }) => (
            <SelectCategory
              categories={categories}
              selectedCategoryId={field.value}
              onCategoryChange={(e) => field.onChange(e.target.value)}
              parentFilter={control.getValues('categorie')}
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
