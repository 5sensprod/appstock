import React, { useState } from 'react'
import { DataGrid, frFR, GridToolbarQuickFilter } from '@mui/x-data-grid'
import { useSuppliers } from '../../contexts/SupplierContext'
import { Button, TextField, Box, Modal, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import { createTheme, ThemeProvider } from '@mui/material/styles'

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

  const columns = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
      editable: false,
      disableColumnMenu: true,
      sortable: false,
      hideable: false,
    },
    { field: 'name', headerName: 'Nom', width: 150 },
    { field: 'contact', headerName: 'Contact', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Téléphone', width: 150 },
    { field: 'iban', headerName: 'IBAN', width: 200 },
    { field: 'address', headerName: 'Adresse', width: 250 },
  ]

  return (
    <ThemeProvider theme={theme}>
      <div>
        <IconButton onClick={handleOpen}>
          <AddIcon />
        </IconButton>
        <div style={{ height: 400, width: 'fit-content' }}>
          <DataGrid
            localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
            rows={suppliers}
            columns={columns}
            pageSize={5}
            getRowId={(row) => row._id}
            components={{ Toolbar: GridToolbarQuickFilter }}
          />
        </div>
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <h2>
              {supplierInfo.id
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
            <Button
              onClick={handleAddOrUpdateSupplier}
              variant="contained"
              color="primary"
            >
              {supplierInfo.id ? <SaveIcon /> : <AddIcon />}
            </Button>
          </Box>
        </Modal>
      </div>
    </ThemeProvider>
  )
}

export default SupplierTable
