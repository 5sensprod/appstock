import React from 'react'
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormControlLabel,
  Switch,
} from '@mui/material'
import { useCategoryContext } from '../../contexts/CategoryContext'
import { useSuppliers } from '../../contexts/SupplierContext'
import { TVA_RATES } from '../../utils/constants'
import CategorySelect from '../CATEGORIES/CategorySelect'
import { useProductFormLogic } from './hooks/useProductFormLogic'

const ProductForm = ({ initialProduct, onSubmit, onCancel }) => {
  const {
    product,
    marge,
    isCalculatingPrice,
    handleInputChange,
    handleMargeChange,
    handlePrixVenteChange,
    handlePrixAchatChange,
    handleTVAChange,
    handleCategoryChange,
    toggleCalculationMode,
  } = useProductFormLogic(initialProduct)

  const { getCategoryPath } = useCategoryContext()
  const { suppliers } = useSuppliers()

  const handleSubmit = (e) => {
    e.preventDefault()
    const formattedMarge = parseFloat(marge.toString().replace(',', '.'))
    onSubmit({ ...product, marge: formattedMarge })
  }

  const selectedCategoryPath = product.categorie
    ? getCategoryPath(product.categorie)
    : ''

  const availableBrands =
    suppliers.find((supplier) => supplier._id === product.supplierId)?.brands ||
    []

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
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Fournisseur</InputLabel>
            <Select
              name="supplierId"
              value={product.supplierId || ''}
              onChange={handleInputChange}
              fullWidth
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
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth disabled={!availableBrands.length}>
            <InputLabel>Marque</InputLabel>
            <Select
              name="marque"
              value={product.marque || ''}
              onChange={handleInputChange}
              fullWidth
            >
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
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="prixAchat"
            label="Prix d'Achat"
            type="number"
            value={product.prixAchat || ''}
            onChange={handlePrixAchatChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={isCalculatingPrice}
                onChange={toggleCalculationMode}
              />
            }
            label={
              isCalculatingPrice ? 'Calculer prix de vente' : 'Calculer marge'
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="marge"
            label="Marge (%)"
            type="text"
            value={marge.toString().replace('.', ',')}
            onChange={handleMargeChange}
            fullWidth
            disabled={!isCalculatingPrice}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="prixVente"
            label="Prix de Vente"
            type="number"
            value={product.prixVente || ''}
            onChange={handlePrixVenteChange}
            fullWidth
            disabled={isCalculatingPrice}
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
          <CategorySelect
            value={selectedCategoryPath}
            onChange={handleCategoryChange}
            label="Catégorie"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>TVA</InputLabel>
            <Select
              name="tva"
              value={product.tva || ''}
              onChange={handleTVAChange}
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
