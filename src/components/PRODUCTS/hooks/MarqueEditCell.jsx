import React, { useState, useEffect } from 'react'
import { Select, MenuItem } from '@mui/material'
import { EventEmitter } from '../../../utils/eventEmitter'

const MarqueEditCell = ({ params, suppliers }) => {
  const [brands, setBrands] = useState([])

  useEffect(() => {
    const handleSupplierChange = (supplierId) => {
      const selectedSupplier = suppliers.find(
        (supplier) => supplier._id === supplierId,
      )
      setBrands(selectedSupplier ? selectedSupplier.brands : [])
    }

    const selectedSupplierId = params.row.supplierId
    handleSupplierChange(selectedSupplierId)

    const updateBrands = (supplierId) => {
      if (supplierId === params.row.supplierId) {
        handleSupplierChange(supplierId)
      }
    }

    EventEmitter.subscribe('SUPPLIER_CHANGED', updateBrands)

    return () => {
      EventEmitter.unsubscribe('SUPPLIER_CHANGED', updateBrands)
    }
  }, [params.row.supplierId, suppliers])

  return (
    <Select
      value={params.value || ''}
      onChange={(event) => {
        params.api.setEditCellValue({
          id: params.id,
          field: 'marque',
          value: event.target.value,
        })
      }}
      fullWidth
    >
      <MenuItem value="">
        <em>Aucune</em>
      </MenuItem>
      {(brands || []).map((brand, index) => (
        <MenuItem key={index} value={brand}>
          {brand}
        </MenuItem>
      ))}
    </Select>
  )
}

export default MarqueEditCell
