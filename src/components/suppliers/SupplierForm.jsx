import React, { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Modal,
  IconButton,
  Chip,
  Grid,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SaveIcon from '@mui/icons-material/Save'
import {
  validateEmail,
  validatePhone,
  validateWebsite,
  validatePostalCode,
} from '../../utils/validationUtils'

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
            <TextField
              label="Nom"
              name="name"
              value={supplierInfo.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Contact"
              name="contact"
              value={supplierInfo.contact}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.contact}
              helperText={errors.contact}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              value={supplierInfo.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Téléphone"
              name="phone"
              value={supplierInfo.phone}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Site Web"
              name="website"
              value={supplierInfo.website}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.website}
              helperText={errors.website}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="IBAN"
              name="iban"
              value={supplierInfo.iban}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.iban}
              helperText={errors.iban}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Rue"
              name="street"
              value={supplierInfo.street}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.street}
              helperText={errors.street}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Ville"
              name="city"
              value={supplierInfo.city}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.city}
              helperText={errors.city}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Code Postal"
              name="postalCode"
              value={supplierInfo.postalCode}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.postalCode}
              helperText={errors.postalCode}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Pays"
              name="country"
              value={supplierInfo.country}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.country}
              helperText={errors.country}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
              <TextField
                label="Ajouter une marque"
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                fullWidth
                margin="normal"
                error={!!errors.newBrand}
                helperText={errors.newBrand}
              />
              <IconButton onClick={handleAddBrand}>
                <AddIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 2 }}
            >
              {(supplierInfo.brands || []).map((brand, index) => (
                <Chip
                  key={index}
                  label={brand}
                  onDelete={() => handleRemoveBrand(index)}
                />
              ))}
            </Box>
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
