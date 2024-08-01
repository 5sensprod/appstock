import React from 'react'
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
}) => (
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
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Contact"
            name="contact"
            value={supplierInfo.contact}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            name="email"
            value={supplierInfo.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Téléphone"
            name="phone"
            value={supplierInfo.phone}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Site Web"
            name="website"
            value={supplierInfo.website}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="IBAN"
            name="iban"
            value={supplierInfo.iban}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Rue"
            name="street"
            value={supplierInfo.street}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Ville"
            name="city"
            value={supplierInfo.city}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Code Postal"
            name="postalCode"
            value={supplierInfo.postalCode}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Pays"
            name="country"
            value={supplierInfo.country}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
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
            />
            <IconButton onClick={handleAddBrand}>
              <AddIcon />
            </IconButton>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 2 }}>
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
            onClick={handleAddOrUpdateSupplier}
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

export default SupplierForm
