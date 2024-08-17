import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material'
import { TVA_RATES } from '../../utils/constants'
import CategorySelect from '../CATEGORIES/CategorySelect'
import { useSuppliers } from '../../contexts/SupplierContext' // Importez le contexte des fournisseurs

const BulkEditForm = ({
  onSubmit,
  onCancel,
  selectedProducts,
  categories = [],
}) => {
  const [bulkData, setBulkData] = useState({
    prixVente: '',
    prixAchat: '',
    stock: '',
    marque: '',
    categorie: '',
    supplierId: '',
    tva: '',
  })

  const { suppliers } = useSuppliers() // Utilisation du contexte des fournisseurs

  // Gère les changements dans les champs de texte
  const handleChange = (e) => {
    setBulkData({
      ...bulkData,
      [e.target.name]: e.target.value,
    })
  }

  // Gère la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault()

    // Crée un tableau de produits avec les modifications
    const updates = selectedProducts.map((productId) => ({
      id: productId,
      changes: {
        ...(bulkData.prixVente !== '' && {
          prixVente: parseFloat(bulkData.prixVente),
        }),
        ...(bulkData.prixAchat !== '' && {
          prixAchat: parseFloat(bulkData.prixAchat),
        }),
        ...(bulkData.stock !== '' && { stock: parseInt(bulkData.stock, 10) }),
        ...(bulkData.marque !== '' && { marque: bulkData.marque }),
        ...(bulkData.categorie !== '' && { categorie: bulkData.categorie }),
        ...(bulkData.supplierId !== '' && { supplierId: bulkData.supplierId }),
        ...(bulkData.tva !== '' && { tva: parseFloat(bulkData.tva) }),
      },
    }))

    // Appelle la fonction onSubmit avec les modifications
    onSubmit(updates)
  }

  // Gère la sélection du fournisseur et réinitialise la marque
  const handleSupplierChange = (e) => {
    const { value } = e.target
    setBulkData((prevData) => ({
      ...prevData,
      supplierId: value,
      marque: '', // Réinitialiser la marque lorsque le fournisseur change
    }))
  }

  // Obtenir les marques disponibles en fonction du fournisseur sélectionné
  const availableBrands =
    suppliers.find((supplier) => supplier._id === bulkData.supplierId)
      ?.brands || []

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* Prix de Vente */}
      <TextField
        label="Prix de Vente"
        name="prixVente"
        type="number"
        value={bulkData.prixVente}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      {/* Prix d'Achat */}
      <TextField
        label="Prix d'Achat"
        name="prixAchat"
        type="number"
        value={bulkData.prixAchat}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      {/* Stock */}
      <TextField
        label="Stock"
        name="stock"
        type="number"
        value={bulkData.stock}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      {/* Sélection du Fournisseur */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Fournisseur</InputLabel>
        <Select
          name="supplierId"
          value={bulkData.supplierId}
          onChange={handleSupplierChange}
        >
          <MenuItem value="">
            <em>Aucun</em>
          </MenuItem>
          {suppliers.map((supplier) => (
            <MenuItem key={supplier._id} value={supplier._id}>
              {supplier.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Sélection de la Marque */}
      <FormControl fullWidth margin="normal" disabled={!availableBrands.length}>
        <InputLabel>Marque</InputLabel>
        <Select name="marque" value={bulkData.marque} onChange={handleChange}>
          <MenuItem value="">
            <em>Aucun</em>
          </MenuItem>
          {availableBrands.map((brand) => (
            <MenuItem key={brand} value={brand}>
              {brand}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Sélection de la Catégorie via CategorySelect */}
      <CategorySelect
        value={bulkData.categorie}
        onChange={(categoryId) =>
          handleChange({ target: { name: 'categorie', value: categoryId } })
        }
        label="Catégorie"
      />

      {/* TVA */}
      <FormControl fullWidth margin="normal">
        <InputLabel>TVA</InputLabel>
        <Select name="tva" value={bulkData.tva} onChange={handleChange}>
          {TVA_RATES.map((rate) => (
            <MenuItem key={rate.value} value={rate.value}>
              {rate.label} %
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box mt={2} display="flex" justifyContent="space-between">
        <Button variant="contained" color="primary" type="submit">
          Appliquer
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Annuler
        </Button>
      </Box>
    </Box>
  )
}

export default BulkEditForm
