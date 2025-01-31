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
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material'
import AutorenewIcon from '@mui/icons-material/Autorenew'
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
    handleGenerateGencode,
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
  const sortedBrands = [...availableBrands].sort((a, b) =>
    a.localeCompare(b, 'fr'),
  )

  const isPrixAchatEmpty =
    !product.prixAchat || parseFloat(product.prixAchat) === 0

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {/* Première ligne */}
        <Grid item xs={12}>
          <TextField
            name="reference"
            label="Référence"
            value={product.reference || ''}
            onChange={handleInputChange}
            fullWidth
            required
            variant="outlined"
          />
        </Grid>
        {/* Champ Désignation */}
        <Grid item xs={12}>
          <TextField
            name="designation"
            label="Désignation"
            value={product.designation || ''}
            onChange={handleInputChange}
            fullWidth
            // required
            variant="outlined"
          />
        </Grid>

        {/* Deuxième ligne */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel shrink={product.supplierId ? true : undefined}>
              Fournisseur
            </InputLabel>
            <Select
              name="supplierId"
              value={product.supplierId || ''}
              onChange={handleInputChange}
              fullWidth
              label="Fournisseur"
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
          <FormControl fullWidth variant="outlined">
            <InputLabel>Marque</InputLabel>
            <Select
              name="brand"
              value={product.brand || ''}
              onChange={handleInputChange}
              label="Marque"
            >
              <MenuItem value="">
                <em>Aucune</em>
              </MenuItem>
              {sortedBrands.map((brand) => (
                <MenuItem key={brand} value={brand}>
                  {brand}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Troisième ligne */}
        <Grid item xs={12} sm={6}>
          <TextField
            name="prixAchat"
            label="Prix d'Achat"
            type="number"
            value={product.prixAchat || ''}
            onChange={handlePrixAchatChange}
            fullWidth
            required
            variant="outlined"
            inputProps={{
              min: '0.01',
              step: '0.01',
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel shrink={product.tva ? true : undefined}>TVA</InputLabel>
            <Select
              name="tva"
              value={product.tva || ''}
              onChange={handleTVAChange}
              fullWidth
              label="TVA"
            >
              {TVA_RATES.map((rate) => (
                <MenuItem key={rate.value} value={rate.value}>
                  {rate.label} %
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Ligne Toggle - Désactivé si prixAchat est vide */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={isCalculatingPrice}
                onChange={toggleCalculationMode}
                disabled={isPrixAchatEmpty} // Désactiver si prixAchat est vide
              />
            }
            label={
              isCalculatingPrice ? 'Calculer prix de vente' : 'Calculer marge'
            }
            style={{
              color: isPrixAchatEmpty ? 'rgba(0, 0, 0, 0.38)' : 'inherit',
            }} // Griser le label si désactivé
          />
        </Grid>

        {/* Ligne Marge et Prix de Vente */}
        <Grid item xs={12} sm={6}>
          <TextField
            name="marge"
            label="Marge (%)"
            type="text"
            value={marge.toString().replace('.', ',')}
            onChange={handleMargeChange}
            fullWidth
            required={isCalculatingPrice} // Obligatoire si toggle sur marge
            disabled={!isCalculatingPrice || isPrixAchatEmpty} // Désactiver si prixAchat est vide
            variant="outlined"
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
            required={!isCalculatingPrice} // Obligatoire si toggle sur prix de vente
            disabled={isCalculatingPrice}
            variant="outlined"
            inputProps={{
              min: '0.01',
              step: '0.01',
            }}
          />
        </Grid>

        {/* Ligne Catégorie et Stock */}
        <Grid item xs={12} sm={6}>
          <CategorySelect
            value={selectedCategoryPath}
            onChange={handleCategoryChange}
            label="Catégorie"
            size="medium" // S'assurer que le champ ait la même hauteur que les autres champs.
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
            variant="outlined"
          />
        </Grid>

        {/* Ligne Code-barres */}
        <Grid item xs={12}>
          <TextField
            name="gencode"
            label="GenCode"
            value={product.gencode || ''}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip
                    title={
                      !product.reference
                        ? 'Veuillez remplir le champ Référence pour générer le gencode'
                        : 'Générer le gencode à partir de la référence'
                    }
                  >
                    <span>
                      {/* Le span est nécessaire pour que le Tooltip fonctionne avec un bouton désactivé */}
                      <IconButton
                        onClick={handleGenerateGencode}
                        edge="end"
                        disabled={!product.reference}
                      >
                        <AutorenewIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Ligne Boutons */}
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
