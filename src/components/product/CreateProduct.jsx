import React, { useState, useEffect } from 'react'
import { FormControl, TextField, Button } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useProductContext } from '../../contexts/ProductContext'
import { useUI } from '../../contexts/UIContext'
import SelectCategory from '../category/SelectCategory'
import CustomSelect from '../ui/CustomSelect'
import { TVA_RATES } from '../../utils/constants'

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
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('')
  const [selectedTVA, setSelectedTVA] = useState(20)

  const { showToast } = useUI()

  const navigate = useNavigate()
  // Structure de données pour les champs de formulaire
  const productFields = [
    { name: 'reference', label: 'Référence', type: 'text' },
    { name: 'prixVente', label: 'Prix de Vente', type: 'number' },
    { name: 'prixAchat', label: 'Prix achat', type: 'number' },
    { name: 'descriptionCourte', label: 'Description courte', type: 'text' },
    { name: 'description', label: 'Description', type: 'text' },
    { name: 'stock', label: 'Stock', type: 'number' },
    { name: 'marque', label: 'Marque', type: 'text' },
    { name: 'gencode', label: 'Gencode', type: 'text' },
    // Ajoutez d'autres champs ici selon vos besoins
  ]

  useEffect(() => {
    register('tva')
    register('categorie')
    register('sousCategorie')
  }, [register])

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value
    setSelectedCategoryId(categoryId)
    setValue('categorie', categoryId)
    setSelectedSubCategoryId('')
    setValue('sousCategorie', '')
  }

  const handleSubCategoryChange = (event) => {
    const subCategoryId = event.target.value
    setSelectedSubCategoryId(subCategoryId)
    setValue('sousCategorie', subCategoryId)
  }

  const handleEnterKey = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault() // Empêcher la soumission du formulaire
      // Vous pouvez ajouter ici une autre logique si nécessaire
    }
  }

  const handleTVAChange = (event) => {
    const newTVAValue = parseFloat(event.target.value)
    setSelectedTVA(newTVAValue)
    setValue('tva', newTVAValue)
  }
  const onSubmit = async (data) => {
    try {
      await addProduct(data)
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
