import React, { useContext } from 'react'
import { useProductContext } from '../../contexts/ProductContext'
import { CartContext } from '../../contexts/CartContext'
import { DataGrid, frFR } from '@mui/x-data-grid'
import { Box } from '@mui/material'

const ProductTable = ({ products }) => {
  const { baseUrl } = useProductContext()
  const { addToCart } = useContext(CartContext)

  const columns = [
    {
      field: 'photo',
      headerName: 'Photo',
      renderCell: (params) =>
        params.row.photos && params.row.photos.length > 0 ? (
          <Box
            component="img"
            src={`${baseUrl}/${params.row.photos[0]}`}
            alt={params.row.reference}
            sx={{ width: 100, height: 'auto' }}
          />
        ) : null,
      width: 110,
    },
    { field: 'reference', headerName: 'Référence', width: 250 },
    { field: 'marque', headerName: 'Marque', width: 130 },
    { field: 'gencode', headerName: 'Gencode', width: 130 },
    {
      field: 'prixVente',
      headerName: 'Prix Vente',
      type: 'number',
      width: 130,
    },
  ]

  const handleRowClick = (params) => {
    addToCart(params.row)
  }

  return (
    <DataGrid
      localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
      rows={products}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 10,
          },
        },
      }}
      pageSizeOptions={[10, 25, 50]}
      pagination
      onRowClick={handleRowClick}
      getRowId={(row) => row._id}
    />
  )
}

export default ProductTable
