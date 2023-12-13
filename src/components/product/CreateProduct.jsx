import React, { useState, useEffect } from 'react'
import { FormControl, TextField, Button } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useProductContext } from '../../contexts/ProductContext'
import { useUI } from '../../contexts/UIContext'
import SelectCategory from '../category/SelectCategory'
import CustomSelect from '../ui/CustomSelect'
import { TVA_RATES } from '../../utils/constants'
import { handleEnterKeyInGencode } from '../../utils/handleUtilsjs'
import { productFields } from '../../utils/formConfig'
import useCategorySelection from '../hooks/useCategorySelection'

export const CreateProduct = () => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm()
  const { categories, addProduct } = useProductContext()
  const [selectedTVA, setSelectedTVA] = useState(20)

  const navigate = useNavigate()
  const { showToast } = useUI()

  useEffect(() => {
    register('tva')
    register('categorie')
    register('sousCategorie')
  }, [register])

  const {
    selectedCategoryId,
    selectedSubCategoryId,
    handleCategoryChange,
    handleSubCategoryChange,
  } = useCategorySelection(setValue)

  const handleTVAChange = (event) => {
    const newTVAValue = parseFloat(event.target.value)
    setSelectedTVA(newTVAValue)
    setValue('tva', newTVAValue)
  }
  const onSubmit = async (data) => {
    try {
      // Conversion des valeurs
      const updatedData = {
        ...data,
        prixVente: parseFloat(data.prixVente) || 0,
        prixAchat: parseFloat(data.prixAchat) || 0,
        stock: parseInt(data.stock, 10) || 0,
      }

      await addProduct(updatedData)
      reset() // Réinitialiser le formulaire
      showToast('Produit ajouté avec succès!', 'success')
      navigate('/catalog')
    } catch (error) {
      console.error(error)
      showToast("Erreur lors de l'ajout du produit", 'error')
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {productFields.map(({ name, label, type }) => {
          let validationRules = {}
          if (name === 'reference' || name === 'prixVente') {
            validationRules.required = 'Ce champ est requis'
          }

          const isTextArea =
            name === 'description' || name === 'descriptionCourte'

          return (
            <FormControl fullWidth margin="normal" key={name}>
              <Controller
                name={name}
                control={control}
                defaultValue=""
                rules={validationRules}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label={label}
                    type={isTextArea ? 'text' : type}
                    multiline={isTextArea}
                    rows={isTextArea ? (name === 'description' ? 4 : 2) : 1}
                    error={!!error}
                    helperText={error ? error.message : null}
                    onKeyDown={
                      name === 'gencode' ? handleEnterKeyInGencode : null
                    }
                  />
                )}
              />
            </FormControl>
          )
        })}
        <FormControl fullWidth margin="normal">
          <SelectCategory
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={handleCategoryChange}
            label="Catégorie"
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <SelectCategory
            categories={categories}
            selectedCategoryId={selectedSubCategoryId}
            onCategoryChange={handleSubCategoryChange}
            parentFilter={selectedCategoryId}
            label="Sous-catégorie"
            disabled={!selectedCategoryId}
          />
        </FormControl>
        <CustomSelect
          label="T.V.A"
          value={selectedTVA}
          onChange={handleTVAChange}
          options={TVA_RATES}
        />
        <Button type="submit" variant="contained" color="primary">
          Ajouter Produit
        </Button>
      </form>
    </>
  )
}

export default CreateProduct
