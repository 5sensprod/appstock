import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { TextField, Button, FormControl, Select, MenuItem } from '@mui/material'
import { useProductContext } from '../../contexts/ProductContext'
import SelectCategory from '../category/SelectCategory'
import { useUI } from '../../contexts/UIContext'

const EditBulkProduct = ({ handleCloseModal }) => {
  const { selectedProducts, updateProductsBulkInContext, categories } =
    useProductContext()
  const { register, handleSubmit, reset } = useForm()
  const [newPrixVente, setNewPrixVente] = useState('')
  const [newPrixAchat, setNewPrixAchat] = useState('')
  const [newStock, setNewStock] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('')
  const { showToast } = useUI()

  const handleCategoryChange = (event) => {
    setSelectedCategoryId(event.target.value)
  }

  const handleSubCategoryChange = (event) => {
    setSelectedSubCategoryId(event.target.value)
  }

  const onSubmit = async (data) => {
    const updates = Array.from(selectedProducts).map((productId) => ({
      id: productId,
      changes: {
        prixVente: parseFloat(data.prixVente) || 0,
        prixAchat: parseFloat(data.prixAchat) || 0,
        stock: parseInt(data.stock, 10) || 0,
        categorie: selectedCategoryId,
        sousCategorie: selectedSubCategoryId,
      },
    }))
    await updateProductsBulkInContext(updates)
    reset()
    handleCloseModal()
    showToast('Produits modifiés avec succès!', 'success')
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Nouveau Prix de Vente"
          {...register('prixVente')}
          value={newPrixVente}
          onChange={(e) => setNewPrixVente(e.target.value)}
          type="number"
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Nouveau Prix d'Achat"
          {...register('prixAchat')}
          value={newPrixAchat}
          onChange={(e) => setNewPrixAchat(e.target.value)}
          type="number"
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Nouveau Stock"
          {...register('stock')}
          value={newStock}
          onChange={(e) => setNewStock(e.target.value)}
          type="number"
        />
      </FormControl>
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
      <Button type="submit" variant="contained" color="primary">
        Appliquer les Modifications
      </Button>
    </form>
  )
}

export default EditBulkProduct
