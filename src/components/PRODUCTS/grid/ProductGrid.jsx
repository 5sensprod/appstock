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
      initialState={{
        ...paginationModel.initialState,
        aggregation: {
          model: {
            prixAchat: 'sum',
            actions: 'size',
          },
        },
      }}
      slotProps={{
        footer: {
          showTotalAggregationFooter: true,
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
