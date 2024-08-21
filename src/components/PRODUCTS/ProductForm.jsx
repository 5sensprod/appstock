import React, { useState, useEffect, useRef } from 'react'
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
import CategorySelect from '../CATEGORIES/CategorySelect'
import { calculatePriceWithMargin } from '../../utils/calculations' // Fonction de calcul

const ProductForm = ({ initialProduct, onSubmit, onCancel }) => {
  const [product, setProduct] = useState(initialProduct)
  const [marge, setMarge] = useState(initialProduct.marge || 0) // Nouvel état pour la marge
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

    if (name === 'supplierId' && product.supplierId !== value) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
        marque: '',
      }))
    } else {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }))
    }
  }

  const handleMargeChange = (e) => {
    const value = parseFloat(e.target.value) || 0
    setMarge(value)

    const prixAchat = parseFloat(product.prixAchat) || 0
    const tvaRate = parseFloat(product.tva) || 20

    if (prixAchat > 0) {
      // Calcul du prix de vente seulement si le prix d'achat est renseigné
      const prixVenteArrondi = calculatePriceWithMargin(
        prixAchat,
        value,
        tvaRate,
      )
      setProduct((prevProduct) => ({
        ...prevProduct,
        prixVente: prixVenteArrondi?.toFixed(2) || '', // Si null, laisse vide
      }))
    }
  }

  const handleCategoryChange = (categoryId) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      categorie: categoryId,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ ...product, marge }) // Enregistre également la marge dans la base de données
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
              onChange={(e) => {
                const { value } = e.target
                if (value === '') {
                  setProduct((prevProduct) => ({
                    ...prevProduct,
                    supplierId: '',
                    marque: '',
                  }))
                } else {
                  handleInputChange(e)
                }
              }}
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
            onChange={(e) => {
              handleInputChange(e)
              handleMargeChange({ target: { value: marge } }) // Recalculer la marge si prix d'achat modifié
            }}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="marge"
            label="Marge (%)"
            type="number"
            value={marge}
            onChange={handleMargeChange}
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
            disabled // Le champ prix de vente est calculé automatiquement
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
              onChange={(e) => {
                handleInputChange(e)
                handleMargeChange({ target: { value: marge } }) // Recalculer la marge si TVA modifiée
              }}
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
