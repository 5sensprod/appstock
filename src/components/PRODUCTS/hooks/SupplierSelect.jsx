import React from 'react'
import { Select, MenuItem } from '@mui/material'
import { EventEmitter } from '../../../utils/eventEmitter'
import { useUI } from '../../../contexts/UIContext' // Importation du contexte UI

const SupplierSelect = ({ params, suppliers }) => {
  const { showToast } = useUI() // Utilisation de showToast

  const handleSupplierChange = (event) => {
    const newSupplierId = event.target.value
    console.log('Emitting SUPPLIER_CHANGED event with:', newSupplierId)
    EventEmitter.dispatch('SUPPLIER_CHANGED', newSupplierId)
    params.api.setEditCellValue({
      id: params.id,
      field: 'supplierId',
      value: newSupplierId,
    })
    params.api.setEditCellValue({
      id: params.id,
      field: 'marque',
      value: '',
    })

    // Afficher le toast pour demander à l'utilisateur de sauvegarder les modifications
    showToast(
      'Veuillez sauvegarder les modifications pour attribuer une nouvelle marque.',
      'warning',
    )
  }

  return (
    <Select
      value={params.row.supplierId || ''}
      onChange={handleSupplierChange}
      fullWidth
    >
      {suppliers.map((supplier) => (
        <MenuItem key={supplier._id} value={supplier._id}>
          {supplier.name}
        </MenuItem>
      ))}
    </Select>
  )
}

export default SupplierSelect
