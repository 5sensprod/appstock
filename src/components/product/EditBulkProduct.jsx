import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { TextField, Button, FormControl } from '@mui/material'
import { useProductContext } from '../../contexts/ProductContext'
import SelectCategory from '../category/SelectCategory'
import { useUI } from '../../contexts/UIContext'

const EditBulkProduct = ({ handleCloseModal, selectedProductIds }) => {
  const { selectedProducts, updateProductsBulkInContext, categories } =
    useProductContext()
  const { register, handleSubmit, reset } = useForm()
  const [newPrixVente, setNewPrixVente] = useState('')
  const [newPrixAchat, setNewPrixAchat] = useState('')
  const [newStock, setNewStock] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('')
  const { showToast, showConfirmDialog } = useUI()

  const handleCategoryChange = (event) => {
    setSelectedCategoryId(event.target.value)
  }

  const handleSubCategoryChange = (event) => {
    setSelectedSubCategoryId(event.target.value)
  }

  const confirmAndSubmit = async (data) => {
    const updates = Array.from(selectedProducts).map((productId) => {
      const changes = {}
      if (data.prixVente) changes.prixVente = parseFloat(data.prixVente)
      if (data.prixAchat) changes.prixAchat = parseFloat(data.prixAchat)
      if (data.stock) changes.stock = parseInt(data.stock, 10)
      if (selectedCategoryId) changes.categorie = selectedCategoryId
      if (selectedSubCategoryId) changes.sousCategorie = selectedSubCategoryId

      return { id: productId, changes }
    })

    await updateProductsBulkInContext(updates)
    reset()
    handleCloseModal()
    showToast('Produits modifiés avec succès!', 'success')
  }

  const onSubmit = (data) => {
    const nombreProduits = selectedProductIds.size
    showConfirmDialog(
      'Confirmer les modifications',
      `Êtes-vous sûr de vouloir modifier ${nombreProduits} produits ?`,
      () => confirmAndSubmit(data),
    )
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
