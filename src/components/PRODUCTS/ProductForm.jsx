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

const ProductForm = ({ initialProduct, onSubmit, onCancel }) => {
  const [product, setProduct] = useState(initialProduct)
  const { getCategoryPath } = useCategoryContext()
  const { suppliers } = useSuppliers()

  // Ref to check if it's the first render
  const isInitialMount = useRef(true)

  // Mettre à jour l'état du produit seulement à l'initialisation ou lors de l'édition, mais pas lors de changements normaux de catégorie
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      setProduct(initialProduct) // Set initial product on mount
    }
  }, [initialProduct])

  // Gère la modification des champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Si le fournisseur change, réinitialiser la marque
    if (name === 'supplierId' && product.supplierId !== value) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
        marque: '', // Réinitialiser uniquement la marque
      }))
    } else {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value, // Mise à jour partielle, conserve les autres champs
      }))
    }
  }

  // Gère la modification de la catégorie via CategorySelect
  const handleCategoryChange = (categoryId) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      categorie: categoryId, // Ne modifie que la catégorie
    }))
  }

  // Gère l'envoi du formulaire
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(product) // Envoie le produit au parent
  }

  // Obtenez le chemin de la catégorie pour l'affichage
  const selectedCategoryPath = product.categorie
    ? getCategoryPath(product.categorie)
    : ''

  // Obtenez les marques disponibles en fonction du fournisseur sélectionné
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
                    marque: '', // Réinitialiser la marque
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
          {/* Utilisation de CategorySelect pour la sélection de catégorie */}
          <CategorySelect
            value={selectedCategoryPath} // Affiche le chemin complet de la catégorie
            onChange={handleCategoryChange} // Met à jour uniquement la catégorie sélectionnée
            label="Catégorie"
          />
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
