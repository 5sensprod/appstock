import React, { useState, useEffect } from 'react'
import { Select, MenuItem } from '@mui/material'
import { EventEmitter } from '../../../utils/eventEmitter'

const MarqueEditCell = ({ params, suppliers }) => {
  const [brands, setBrands] = useState([])

  useEffect(() => {
    const handleSupplierChange = (supplierId) => {
      console.log('Received SUPPLIER_CHANGED event with:', supplierId)
      const selectedSupplier = suppliers.find(
        (supplier) => supplier._id === supplierId,
      )
      console.log('Selected Supplier:', selectedSupplier)
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
        console.log('Brand changed:', event.target.value)
        params.api.setEditCellValue({
          id: params.id,
          field: 'marque',
          value: event.target.value,
        })
      }}
      fullWidth
    >
      {brands.map((brand, index) => (
        <MenuItem key={index} value={brand}>
          {brand}
        </MenuItem>
      ))}
    </Select>
  )
}

export default MarqueEditCell
