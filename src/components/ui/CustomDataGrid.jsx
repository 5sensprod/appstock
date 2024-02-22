import React from 'react'
import { DataGrid, frFR } from '@mui/x-data-grid'
import { formatPrice } from '../../utils/priceUtils'
import { Button } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { IconButton } from '@mui/material'

const CustomDataGrid = ({
  rows,
  loading,
  includeCustomerName,
  onViewDetails,
}) => {
  const columns = [
    {
      field: 'number',
      headerName: includeCustomerName
        ? 'Numéro de facture'
        : 'Numéro de ticket',
      width: 200,
    },
    { field: 'date', headerName: 'Date', width: 150 },
    {
      field: 'totalTTC',
      headerName: 'Total TTC',
      width: 160,
      valueFormatter: ({ value }) => formatPrice(value),
    },
  ]

  if (includeCustomerName) {
    columns.splice(1, 0, {
      field: 'customerName',
      headerName: 'Nom du client',
      width: 200,
    })
  }

  // Ajoutez cette colonne d'actions si une fonction onViewDetails est fournie
  if (onViewDetails) {
    columns.push({
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <IconButton onClick={() => params.row.onViewDetails()}>
          <VisibilityIcon />
        </IconButton>
      ),
    })
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        loading={loading}
        localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
      />
    </div>
  )
}

export default CustomDataGrid
