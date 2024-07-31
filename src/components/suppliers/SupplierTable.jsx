import React, { useState } from 'react'
import { DataGrid, frFR, GridToolbarQuickFilter } from '@mui/x-data-grid'
import { useSuppliers } from '../../contexts/SupplierContext'
import { IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import SupplierColumns from './SupplierColumns'
import SupplierForm from './SupplierForm'

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f0f0f0',
          },
        },
      },
      defaultProps: {
        localeText: frFR.components.MuiDataGrid.defaultProps.localeText,
      },
    },
  },
})

const SupplierTable = () => {
  const { suppliers, createSupplier, modifySupplier, removeSupplier } =
    useSuppliers()
  const [open, setOpen] = useState(false)
  const [supplierInfo, setSupplierInfo] = useState({
    id: '',
    name: '',
    contact: '',
    email: '',
    phone: '',
    iban: '',
    address: '',
  })

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSupplierInfo({ ...supplierInfo, [name]: value })
  }

  const handleAddOrUpdateSupplier = async () => {
    if (supplierInfo.id) {
      await modifySupplier(supplierInfo.id, supplierInfo)
    } else {
      await createSupplier(supplierInfo)
    }
    handleClose()
    setSupplierInfo({
      id: '',
      name: '',
      contact: '',
      email: '',
      phone: '',
      iban: '',
      address: '',
    })
  }

  const handleEdit = (supplier) => {
    setSupplierInfo({ ...supplier, id: supplier._id })
    handleOpen()
  }

  const handleDelete = async (id) => {
    await removeSupplier(id)
  }

  const columns = SupplierColumns(handleEdit, handleDelete)

  return (
    <ThemeProvider theme={theme}>
      <div>
        <IconButton onClick={handleOpen}>
          <AddIcon />
        </IconButton>
        <div style={{ width: 'fit-content' }}>
          <DataGrid
            localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
            rows={suppliers}
            columns={columns}
            pageSize={5}
            getRowId={(row) => row._id}
            components={{ Toolbar: GridToolbarQuickFilter }}
          />
        </div>
        <SupplierForm
          open={open}
          handleClose={handleClose}
          supplierInfo={supplierInfo}
          handleInputChange={handleInputChange}
          handleAddOrUpdateSupplier={handleAddOrUpdateSupplier}
        />
      </div>
    </ThemeProvider>
  )
}

export default SupplierTable
