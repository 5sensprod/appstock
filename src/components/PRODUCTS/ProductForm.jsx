import React from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
} from '@mui/material'
import SupplierSelect from './hooks/SupplierSelect'

const ProductForm = ({
  open,
  handleClose,
  productInfo,
  handleInputChange,
  handleSave,
  suppliers,
  isEditing,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? 'Modifier le produit' : 'Ajouter un produit'}
      </DialogTitle>
      <DialogContent>
        <TextField
          name="reference"
          label="Référence"
          fullWidth
          value={productInfo.reference}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          name="prixAchat"
          label="Prix d'Achat"
          type="number"
          fullWidth
          value={productInfo.prixAchat}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          name="prixVente"
          label="Prix de Vente"
          type="number"
          fullWidth
          value={productInfo.prixVente}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          name="stock"
          label="Stock"
          type="number"
          fullWidth
          value={productInfo.stock}
          onChange={handleInputChange}
          margin="normal"
        />
        <SupplierSelect
          value={productInfo.supplierId}
          onChange={(e) =>
            handleInputChange({
              target: { name: 'supplierId', value: e.target.value },
            })
          }
          suppliers={suppliers}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {isEditing ? 'Enregistrer' : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProductForm
