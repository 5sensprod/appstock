import React from 'react'
import {
  DataGrid,
  frFR,
  useGridApiRef,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid'
import { formatPrice } from '../../utils/priceUtils'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { IconButton, Box, TextField } from '@mui/material'

const CustomDataGrid = ({
  rows,
  loading,
  includeCustomerName,
  includeCustomerAddress,
  onViewDetails,
  onPdfIconClick,
}) => {
  const apiRef = useGridApiRef()

  const columns = [
    {
      field: 'actions',
      headerName: '',
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <IconButton
            onClick={() => onViewDetails(params.row.id)}
            color="primary"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            onClick={() => onPdfIconClick(params.row)}
            color="primary"
          >
            <PictureAsPdfIcon />
          </IconButton>
        </div>
      ),
    },
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

  if (includeCustomerAddress) {
    // Vérifiez si la colonne "Adresse du client" doit être incluse
    const customerAddressColumn = {
      field: 'customerAddress',
      headerName: 'Adresse du client',
      width: 200,
    }

    // Déterminez l'index où la colonne "Adresse du client" doit être insérée
    const insertionIndex = includeCustomerName ? 2 : 1

    // Insérez la colonne "Adresse du client" dans la liste des colonnes
    columns.splice(insertionIndex, 0, customerAddressColumn)
  }

  return (
    <Box sx={{ width: 'fit-content' }}>
      <DataGrid
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        pagination
        loading={loading}
        localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
        components={{ Toolbar: GridToolbarQuickFilter }}
      />
    </Box>
  )
}

export default CustomDataGrid
