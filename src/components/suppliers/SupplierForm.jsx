import React from 'react'
import { Box, TextField, Button, Modal, IconButton, Chip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SaveIcon from '@mui/icons-material/Save'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
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
      <TextField
        label="Nom"
        name="name"
        value={supplierInfo.name}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Contact"
        name="contact"
        value={supplierInfo.contact}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        name="email"
        value={supplierInfo.email}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Téléphone"
        name="phone"
        value={supplierInfo.phone}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="IBAN"
        name="iban"
        value={supplierInfo.iban}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Adresse"
        name="address"
        value={supplierInfo.address}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 2 }}>
        {(supplierInfo.brands || []).map((brand, index) => (
          <Chip
            key={index}
            label={brand}
            onDelete={() => handleRemoveBrand(index)}
          />
        ))}
      </Box>
      <Button
        onClick={handleAddOrUpdateSupplier}
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
      >
        {supplierInfo._id ? <SaveIcon /> : <AddIcon />}
      </Button>
    </Box>
  </Modal>
)

export default SupplierForm
