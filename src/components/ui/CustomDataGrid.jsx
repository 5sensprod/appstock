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
          <IconButton onClick={() => onViewDetails(params.row.id)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => onPdfIconClick(params.row)}>
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

  // Gestionnaire pour la mise à jour du filtre de recherche
  const handleSearchChange = (event) => {
    apiRef.current.setQuickFilter(event.target.value)
  }

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Rechercher..."
          onChange={handleSearchChange}
          size="small"
        />
      </Box> */}
      <DataGrid
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        pageSize={5}
        loading={loading}
        localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
        components={{ Toolbar: GridToolbarQuickFilter }} // Vous pouvez omettre cette ligne si vous souhaitez utiliser votre propre champ de recherche au lieu de GridToolbarQuickFilter
      />
    </Box>
  )
}

export default CustomDataGrid
