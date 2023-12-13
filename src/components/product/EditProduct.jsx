import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { TextField, Button, FormControl } from '@mui/material'
import { useProductContext } from '../../contexts/ProductContext'
import SelectCategory from '../category/SelectCategory'
import CustomSelect from '../ui/CustomSelect'
import { useUI } from '../../contexts/UIContext'
import { TVA_RATES } from '../../utils/constants'
import { useNavigate } from 'react-router-dom'
import { handleEnterKeyInGencode } from '../../utils/handleUtilsjs'
import { productFields } from '../../utils/formConfig'
import useCategorySelection from '../hooks/useCategorySelection'

const EditProduct = ({ productId }) => {
  const { updateProductInContext, products, categories } = useProductContext()
  const { control, handleSubmit, setValue, register } = useForm()
  const [initialLoading, setInitialLoading] = useState(true)
  const [selectedTVA, setSelectedTVA] = useState(20)

  const navigate = useNavigate()
  const { showToast } = useUI()

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

  const {
    selectedCategoryId,
    setSelectedCategoryId,
    selectedSubCategoryId,
    setSelectedSubCategoryId,
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

      await updateProductInContext(productId, updatedData)
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
        const isTextArea =
          name === 'description' || name === 'descriptionCourte'

        if (isTextArea) {
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
                    multiline
                    rows={name === 'description' ? 8 : 2} // Exemple: 4 lignes pour 'description' et 2 pour 'descriptionCourte'
                  />
                )}
              />
            </FormControl>
          )
        } else if (type === 'text' || type === 'number') {
          // Rendu standard pour les autres champs
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
