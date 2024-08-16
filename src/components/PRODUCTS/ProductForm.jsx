import React, { useState, useEffect } from 'react'
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material'
import { useCategoryContext } from '../../contexts/CategoryContext'
import { useSuppliers } from '../../contexts/SupplierContext'
import { TVA_RATES } from '../../utils/constants'

const ProductForm = ({ initialProduct, onSubmit, onCancel }) => {
  const [product, setProduct] = useState(initialProduct)
  const { categories } = useCategoryContext()
  const { suppliers } = useSuppliers()

  // Mettre à jour l'état du produit lorsque initialProduct change
  useEffect(() => {
    setProduct(initialProduct)
  }, [initialProduct])

  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Si le fournisseur change, réinitialiser la marque
    if (name === 'supplierId' && product.supplierId !== value) {
      setProduct({
        ...product,
        [name]: value,
        marque: '', // Réinitialiser la marque
      })
    } else {
      setProduct({
        ...product,
        [name]: value,
      })
    }
  }

  // Obtenir les marques disponibles en fonction du fournisseur sélectionné
  const availableBrands =
    suppliers.find((supplier) => supplier._id === product.supplierId)?.brands ||
    []

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(product) // Envoie le produit au parent
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="reference"
            label="Référence"
            value={product.reference || ''}
            onChange={handleInputChange}
            fullWidth
            required // Seule la référence est obligatoire
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Fournisseur</InputLabel>
            <Select
              name="supplierId"
              value={product.supplierId || ''}
              onChange={handleInputChange}
              fullWidth
            >
              {suppliers.map((supplier) => (
                <MenuItem key={supplier._id} value={supplier._id}>
                  {supplier.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            required={!!product.supplierId}
            disabled={!availableBrands.length}
          >
            <InputLabel>Marque</InputLabel>
            <Select
              name="marque"
              value={product.marque || ''}
              onChange={handleInputChange}
              fullWidth
            >
              {availableBrands.map((brand) => (
                <MenuItem key={brand} value={brand}>
                  {brand}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="prixAchat"
            label="Prix d'Achat"
            type="number"
            value={product.prixAchat || ''}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="prixVente"
            label="Prix de Vente"
            type="number"
            value={product.prixVente || ''}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="stock"
            label="Stock"
            type="number"
            value={product.stock || ''}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="gencode"
            label="GenCode"
            value={product.gencode || ''}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Catégorie</InputLabel>
            <Select
              name="categorie"
              value={product.categorie || ''}
              onChange={handleInputChange}
              fullWidth
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>TVA</InputLabel>
            <Select
              name="tva"
              value={product.tva || ''}
              onChange={handleInputChange}
              fullWidth
            >
              {TVA_RATES.map((rate) => (
                <MenuItem key={rate.value} value={rate.value}>
                  {rate.label} %
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Enregistrer
          </Button>
          <Button
            onClick={onCancel}
            variant="outlined"
            color="secondary"
            style={{ marginLeft: 8 }}
          >
            Annuler
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default ProductForm
