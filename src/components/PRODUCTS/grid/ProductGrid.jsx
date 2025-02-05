import React from 'react'
import {
  DataGridPremium,
  frFR,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium'
import { Typography } from '@mui/material'

const ProductGrid = ({
  products,
  columns,
  paginationModel,
  onPaginationModelChange,
  onSelectionChange,
  selectionModel,
  sortModel,
  onSortModelChange,
}) => {
  if (products.length === 0) {
    return <Typography variant="h6">Aucun produit trouvé</Typography>
  }

  return (
    <DataGridPremium
      rows={products}
      columns={columns}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      pageSize={paginationModel.pageSize}
      pageSizeOptions={[10, 25, 50, 100]}
      localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
      slots={{ toolbar: GridToolbarQuickFilter }}
      getRowId={(row) => row._id}
      pagination
      checkboxSelection
      disableRowSelectionOnClick
      onRowSelectionModelChange={onSelectionChange}
      rowSelectionModel={selectionModel}
      experimentalFeatures={{ aggregation: true }}
      sortModel={sortModel}
      onSortModelChange={onSortModelChange}
      sortingOrder={['desc', 'asc']}
      initialState={{
        sorting: {
          sortModel: [{ field: 'dateSoumission', sort: 'desc' }],
        },
        ...paginationModel.initialState,
        aggregation: {
          model: {
            prixAchat: 'sum',
            actions: 'size',
          },
        },
      }}
      sx={{
        '& [data-field="actions"] .MuiDataGrid-aggregationColumnHeaderLabel': {
          display: 'none',
        },
      }}
    />
  )
}

export default ProductGrid
