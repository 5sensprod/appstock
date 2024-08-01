import React, { useState } from 'react'
import { Box, Button, Modal, Grid } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SaveIcon from '@mui/icons-material/Save'
import {
  validateEmail,
  validatePhone,
  validateWebsite,
  validatePostalCode,
} from '../../utils/validationUtils'
import TextFieldWithValidation from './TextFieldWithValidation'
import BrandChipInput from './BrandChipInput'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const SupplierForm = ({
  open,
  handleClose,
  supplierInfo,
  handleInputChange,
  handleAddOrUpdateSupplier,
  handleAddBrand,
  handleRemoveBrand,
  newBrand,
  setNewBrand,
}) => {
  const [errors, setErrors] = useState({})

  const handleValidation = (name, value) => {
    let error = ''

    if (!value) {
      error = '' // Remove error if the field is empty
    } else {
      switch (name) {
        case 'email':
          if (!validateEmail(value)) {
            error = 'Email invalide (ex: exemple@domaine.com)'
          }
          break
        case 'phone':
          if (!validatePhone(value)) {
            error = 'Téléphone invalide (10 chiffres requis)'
          }
          break
        case 'website':
          if (!validateWebsite(value)) {
            error = 'Site web invalide (ex: https://www.exemple.com)'
          }
          break
        case 'postalCode':
          if (!validatePostalCode(value)) {
            error = 'Code postal invalide (5 chiffres requis)'
          }
          break
        default:
          break
      }
    }

    setErrors({ ...errors, [name]: error })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    handleInputChange(e)
    handleValidation(name, value)
  }

  const isFormValid = () => {
    const newErrors = {}
    handleValidation('email', supplierInfo.email)
    handleValidation('phone', supplierInfo.phone)
    handleValidation('website', supplierInfo.website)
    handleValidation('postalCode', supplierInfo.postalCode)

    return (
      !newErrors.email &&
      !newErrors.phone &&
      !newErrors.website &&
      !newErrors.postalCode
    )
  }

  const handleSave = () => {
    if (isFormValid()) {
      handleAddOrUpdateSupplier()
    } else {
      alert('Veuillez corriger les erreurs avant de soumettre le formulaire.')
    }
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <h2>
          {supplierInfo._id
            ? 'Modifier le fournisseur'
            : 'Ajouter un fournisseur'}
        </h2>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextFieldWithValidation
              label="Nom"
              name="name"
              value={supplierInfo.name}
              onChange={handleChange}
              error={errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextFieldWithValidation
              label="Contact"
              name="contact"
              value={supplierInfo.contact}
              onChange={handleChange}
              error={errors.contact}
              helperText={errors.contact}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextFieldWithValidation
              label="Email"
              name="email"
              value={supplierInfo.email}
              onChange={handleChange}
              error={errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextFieldWithValidation
              label="Téléphone"
              name="phone"
              value={supplierInfo.phone}
              onChange={handleChange}
              error={errors.phone}
              helperText={errors.phone}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextFieldWithValidation
              label="Site Web"
              name="website"
              value={supplierInfo.website}
              onChange={handleChange}
              error={errors.website}
              helperText={errors.website}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextFieldWithValidation
              label="IBAN"
              name="iban"
              value={supplierInfo.iban}
              onChange={handleChange}
              error={errors.iban}
              helperText={errors.iban}
            />
          </Grid>
          <Grid item xs={12}>
            <TextFieldWithValidation
              label="Rue"
              name="street"
              value={supplierInfo.street}
              onChange={handleChange}
              error={errors.street}
              helperText={errors.street}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextFieldWithValidation
              label="Ville"
              name="city"
              value={supplierInfo.city}
              onChange={handleChange}
              error={errors.city}
              helperText={errors.city}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextFieldWithValidation
              label="Code Postal"
              name="postalCode"
              value={supplierInfo.postalCode}
              onChange={handleChange}
              error={errors.postalCode}
              helperText={errors.postalCode}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextFieldWithValidation
              label="Pays"
              name="country"
              value={supplierInfo.country}
              onChange={handleChange}
              error={errors.country}
              helperText={errors.country}
            />
          </Grid>
          <Grid item xs={12}>
            <BrandChipInput
              newBrand={newBrand}
              setNewBrand={setNewBrand}
              handleAddBrand={handleAddBrand}
              handleRemoveBrand={handleRemoveBrand}
              brands={supplierInfo.brands || []}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              {supplierInfo._id ? <SaveIcon /> : <AddIcon />}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default SupplierForm
