import React from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import { IconButton } from '@mui/material'
import { formatPhoneNumber } from '../../utils/phoneUtils'

const SupplierColumns = (handleEdit, handleDelete, handleViewDetails) => [
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
        <IconButton onClick={() => handleViewDetails(params.row)}>
          <SearchIcon />
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
  {
    field: 'phone',
    headerName: 'Téléphone',
    width: 150,
    valueFormatter: (params) => formatPhoneNumber(params.value),
  },
  { field: 'website', headerName: 'Site Web', width: 200 },
]

export default SupplierColumns
