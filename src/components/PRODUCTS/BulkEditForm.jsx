import React, { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { TVA_RATES } from '../../utils/constants'
import CategorySelect from '../CATEGORIES/CategorySelect'
import { useSuppliers } from '../../contexts/SupplierContext'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'

// Fonction pour calculer le prix de vente en fonction de la marge, du prix d'achat et de la TVA
const calculatePriceWithMarginAndVAT = (prixAchat, marge, tva) => {
  if (!prixAchat || !marge) return null

  const prixVenteHT = prixAchat * (1 + marge / 100)

  // Si la TVA est à 0, on ne l'inclut pas dans le calcul du prix de vente
  const prixVenteTTC = tva > 0 ? prixVenteHT * (1 + tva / 100) : prixVenteHT

  return prixVenteTTC.toFixed(2) // Retourne le prix de vente TTC (ou HT si TVA est à 0) avec 2 décimales
}

const BulkEditForm = ({ onSubmit, onCancel, selectedProducts }) => {
  const [bulkData, setBulkData] = useState({
    marge: '',
    stock: '',
    tva: '',
    categorie: '',
  })

  const { suppliers } = useSuppliers()
  const { products } = useProductContextSimplified() // Récupérer les produits depuis le contexte

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

    const updates = selectedProducts
      .map((productId) => {
        const product = products.find((p) => p._id === productId)
        if (!product) return null

        const changes = {}

        // Si la marge ou la TVA est modifiée, recalculer le prix de vente
        if (bulkData.marge !== '' || bulkData.tva !== '') {
          const prixAchat = product.prixAchat
          const marge =
            bulkData.marge !== '' ? parseFloat(bulkData.marge) : product.marge
          const tva =
            bulkData.tva !== '' ? parseFloat(bulkData.tva) : product.tva

          changes.prixVente = calculatePriceWithMarginAndVAT(
            prixAchat,
            marge,
            tva,
          )
          changes.marge = marge
          changes.tva = tva
        }

        // Mise à jour des autres champs
        if (bulkData.stock !== '') {
          changes.stock = parseInt(bulkData.stock, 10)
        }
        if (bulkData.categorie !== '') {
          changes.categorie = bulkData.categorie
        }

        return { id: productId, changes }
      })
      .filter((update) => update !== null)

    // Appelle la fonction onSubmit avec les modifications
    onSubmit(updates)
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* Champ de modification de la marge */}
      <TextField
        label="Marge (%)"
        name="marge"
        type="number"
        value={bulkData.marge}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      {/* Champ de modification du stock */}
      <TextField
        label="Stock"
        name="stock"
        type="number"
        value={bulkData.stock}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      {/* Sélection de la Catégorie via CategorySelect */}
      <CategorySelect
        value={bulkData.categorie}
        onChange={(categoryId) =>
          handleChange({ target: { name: 'categorie', value: categoryId } })
        }
        label="Catégorie"
        size="medium"
      />

      {/* Sélection de la TVA */}
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
