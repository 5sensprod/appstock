import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { TextField, Button, FormControl } from '@mui/material'
import { useProductContext } from '../../contexts/ProductContext'
import SelectCategory from '../category/SelectCategory'
import CustomSelect from '../ui/CustomSelect'
import { useUI } from '../../contexts/UIContext'
import { TVA_RATES } from '../../utils/constants'
import { useNavigate } from 'react-router-dom'

const EditProduct = ({ productId }) => {
  const { updateProductInContext, products, categories } = useProductContext()
  const { control, handleSubmit, setValue, register } = useForm()
  const [initialLoading, setInitialLoading] = useState(true)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('')
  const [selectedTVA, setSelectedTVA] = useState(20)

  const navigate = useNavigate()
  const { showToast } = useUI()

  const productFields = [
    { name: 'reference', label: 'Référence', type: 'text' },
    { name: 'prixVente', label: 'Prix de Vente', type: 'number' },
    { name: 'prixAchat', label: 'Prix achat', type: 'number' },
    { name: 'descriptionCourte', label: 'Description courte', type: 'text' },
    { name: 'description', label: 'Description', type: 'text' },
    { name: 'stock', label: 'Stock', type: 'number' },
    { name: 'marque', label: 'Marque', type: 'text' },
    { name: 'gencode', label: 'Gencode', type: 'text' },
    { name: 'tva', label: 'T.V.A', type: 'select', options: TVA_RATES },
    {
      name: 'categorie',
      label: 'Catégorie',
      type: 'select',
      options: categories,
    },
    {
      name: 'sousCategorie',
      label: 'Sous-catégorie',
      type: 'select',
      options: categories,
    },
    // Ajoutez d'autres champs ici selon vos besoins
  ]

  useEffect(() => {
    if (initialLoading && products.length > 0) {
      const productToEdit = products.find((p) => p._id === productId)
      if (productToEdit) {
        Object.keys(productToEdit).forEach((key) => {
          setValue(key, productToEdit[key])
          if (key === 'categorie') setSelectedCategoryId(productToEdit[key])
          if (key === 'sousCategorie')
            setSelectedSubCategoryId(productToEdit[key])
          if (key === 'tva') setSelectedTVA(productToEdit[key])
        })
      }
      setInitialLoading(false)
    }
  }, [products, productId, setValue, initialLoading])

  useEffect(() => {
    register('categorie')
    register('sousCategorie')
    register('tva')
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

  const handleTVAChange = (event) => {
    const newTVAValue = parseFloat(event.target.value)
    setSelectedTVA(newTVAValue)
    setValue('tva', newTVAValue)
  }

  const handleEnterKeyInGencode = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      // Ajouter des actions supplémentaires si nécessaire
    }
  }

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
      {productFields.map(({ name, label, type }) => {
        if (type === 'text' || type === 'number') {
          return (
            <FormControl fullWidth margin="normal" key={name}>
              <Controller
                name={name}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={label}
                    type={type}
                    onKeyDown={
                      name === 'gencode' ? handleEnterKeyInGencode : null
                    }
                  />
                )}
              />
            </FormControl>
          )
        }
        return null
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

      <FormControl fullWidth margin="normal">
        <CustomSelect
          label="T.V.A"
          value={selectedTVA}
          onChange={handleTVAChange}
          options={TVA_RATES}
        />
      </FormControl>

      <Button type="submit" variant="contained" color="primary">
        Modifier
      </Button>
    </form>
  )
}

export default EditProduct