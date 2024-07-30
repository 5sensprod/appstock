import React from 'react'
import SupplierTable from '../suppliers/SupplierTable'
import Typography from '@mui/material/Typography'

const SupplierPage = () => {
  return (
    <div>
      <Typography variant="h5" mb={2}>
        FOURNISSEURS
      </Typography>
      <SupplierTable />
    </div>
  )
}

export default SupplierPage
