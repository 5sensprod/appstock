import React, { useState, useEffect, useRef } from 'react'
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
import {
  calculatePriceWithMargin,
  calculateMarginFromPrice,
} from '../../utils/calculations'

const ProductForm = ({ initialProduct, onSubmit, onCancel }) => {
  const [product, setProduct] = useState(initialProduct)
  const [marge, setMarge] = useState(parseFloat(initialProduct.marge) || 0)
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(true)
  const { getCategoryPath } = useCategoryContext()
  const { suppliers } = useSuppliers()

  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      setProduct(initialProduct)
    }
  }, [initialProduct])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }))
  }

  const handleMargeChange = (e) => {
    let value = e.target.value

    // Remplacer les virgules par des points pour les décimales
    value = value.replace(',', '.')

    // Convertir la valeur en nombre
    const numericValue = parseFloat(value) || 0
    setMarge(numericValue)

    if (isCalculatingPrice) {
      const prixAchat = parseFloat(product.prixAchat) || 0
      const tvaRate = parseFloat(product.tva) || 0

      if (prixAchat > 0) {
        const prixVenteArrondi = calculatePriceWithMargin(
          prixAchat,
          numericValue,
          tvaRate,
        )
        setProduct((prevProduct) => ({
          ...prevProduct,
          prixVente: prixVenteArrondi?.toFixed(2) || '', // Mise à jour du prix de vente
        }))
      }
    }
  }

  const handlePrixVenteChange = (e) => {
    const value = parseFloat(e.target.value) || 0
    setProduct((prevProduct) => ({
      ...prevProduct,
      prixVente: value,
    }))

    if (!isCalculatingPrice) {
      const prixAchat = parseFloat(product.prixAchat) || 0
      const tvaRate = parseFloat(product.tva) || 0

      if (prixAchat > 0 && value > 0) {
        const calculatedMarge = calculateMarginFromPrice(
          prixAchat,
          value,
          tvaRate,
        )
        setMarge(calculatedMarge.toFixed(2)) // Mise à jour de la marge limitée à 2 décimales
      }
    }
  }

  const handleCategoryChange = (categoryId) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      categorie: categoryId,
    }))
  }

  const handleTVAChange = (e) => {
    const tvaRate = parseFloat(e.target.value) || 0

    handleInputChange(e)

    if (isCalculatingPrice) {
      const prixAchat = parseFloat(product.prixAchat) || 0

      if (prixAchat > 0) {
        const prixVenteArrondi = calculatePriceWithMargin(
          prixAchat,
          marge,
          tvaRate,
        )
        setProduct((prevProduct) => ({
          ...prevProduct,
          prixVente: prixVenteArrondi?.toFixed(2) || '',
        }))
      }
    } else {
      const prixVente = parseFloat(product.prixVente) || 0
      const prixAchat = parseFloat(product.prixAchat) || 0

      if (prixAchat > 0 && prixVente > 0) {
        const calculatedMarge = calculateMarginFromPrice(
          prixAchat,
          prixVente,
          tvaRate,
        )
        setMarge(calculatedMarge.toFixed(2))
      }
    }
  }

  const handlePrixAchatChange = (e) => {
    handleInputChange(e)
    const prixAchat = parseFloat(e.target.value) || 0
    const tvaRate = parseFloat(product.tva) || 0

    if (prixAchat > 0) {
      if (isCalculatingPrice) {
        const prixVenteArrondi = calculatePriceWithMargin(
          prixAchat,
          marge,
          tvaRate,
        )
        setProduct((prevProduct) => ({
          ...prevProduct,
          prixVente: prixVenteArrondi?.toFixed(2) || '',
        }))
      } else {
        const prixVente = parseFloat(product.prixVente) || 0

        if (prixVente > 0) {
          const calculatedMarge = calculateMarginFromPrice(
            prixAchat,
            prixVente,
            tvaRate,
          )
          setMarge(calculatedMarge.toFixed(2))
        }
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Toujours enregistrer la marge avec un point comme séparateur décimal pour la base de données
    const formattedMarge = parseFloat(marge.toString().replace(',', '.'))

    onSubmit({ ...product, marge: formattedMarge }) // Enregistre la marge en nombre
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
            onChange={handlePrixAchatChange} // Changement du prix d'achat
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={isCalculatingPrice}
                onChange={() => setIsCalculatingPrice(!isCalculatingPrice)}
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
            type="text" // Champ texte pour gérer la virgule et le point
            value={marge}
            onChange={handleMargeChange}
            fullWidth
            disabled={!isCalculatingPrice} // Désactiver si on calcule la marge
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
            disabled={isCalculatingPrice} // Désactiver si on calcule le prix
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
              onChange={handleTVAChange} // Changement de la TVA
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
