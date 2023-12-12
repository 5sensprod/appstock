import React from 'react'
import { useProductContext } from '../../contexts/ProductContext'
import { DataGrid, frFR } from '@mui/x-data-grid'

const ProductTableMobil = ({ products }) => {
  // Utilisation de useProductContext() si nécessaire
  // const { baseUrl } = useProductContext();

  const columns = [
    { field: 'reference', headerName: 'Référence', flex: 1 }, // Utilisation de flex
    { field: 'gencode', headerName: 'Gencode', flex: 1 },
    {
      field: 'prixVente',
      headerName: 'Prix Vente',
      type: 'number',
      flex: 1,
    },
  ]

  return (
    <DataGrid
      localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
      rows={products}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
      pageSizeOptions={[10, 25, 50]}
      pagination
      getRowId={(row) => row._id}
      sx={{
        width: '100%', // Assurez-vous que le DataGrid occupe toute la largeur
        '.MuiDataGrid-virtualScroller': {
          overflowX: 'auto', // Permet le défilement horizontal
        },
      }}
    />
  )
}

export default ProductTableMobil
