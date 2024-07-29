import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { useSuppliers } from '../../contexts/SupplierContext'
import { Button, TextField, Box, Modal } from '@mui/material'

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
    { field: 'name', headerName: 'Nom', width: 150 },
    { field: 'contact', headerName: 'Contact', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Téléphone', width: 150 },
    { field: 'iban', headerName: 'IBAN', width: 200 },
    { field: 'address', headerName: 'Adresse', width: 250 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div>
          <Button onClick={() => handleEdit(params.row)}>Modifier</Button>
          <Button onClick={() => handleDelete(params.row._id)}>
            Supprimer
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <Button onClick={handleOpen}>Ajouter un fournisseur</Button>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={suppliers}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row._id} // Utilisez _id comme identifiant unique pour chaque ligne
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
            {supplierInfo.id ? 'Modifier' : 'Ajouter'}
          </Button>
        </Box>
      </Modal>
    </div>
  )
}

export default SupplierTable
