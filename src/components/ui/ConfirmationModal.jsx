import React, { useEffect, useState } from 'react'
import {
  Modal,
  Box,
  Button,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { formatPrice } from '../../utils/priceUtils'
import { useUI } from '../../contexts/UIContext'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const ConfirmationModal = ({
  open,
  onClose,
  preparedData,
  handleAction,
  customerInfo,
  setCustomerInfo,
  showCustomerFields,
  setShowCustomerFields,
  title,
  actionLabel,
}) => {
  const { showToast } = useUI()

  const columns = [
    {
      field: 'reference',
      headerName: 'Référence',
      width: 150,
      sortable: false,
      flex: 1,
    },
    {
      field: 'quantity',
      headerName: 'Quantité',
      type: 'number',
      width: 110,
      sortable: false,
      flex: 0.5,
    },
    {
      field: 'prixHT',
      headerName: 'Prix HT',
      type: 'number',
      width: 130,
      flex: 1,
      renderCell: (params) => formatPrice(Number(params.value)),
    },
    {
      field: 'prixTTC',
      headerName: 'Prix TTC',
      type: 'number',
      width: 130,
      flex: 1,
      renderCell: (params) => formatPrice(Number(params.value)),
    },
    {
      field: 'tauxTVA',
      headerName: 'TVA',
      type: 'number',
      width: 130,
      sortable: false,
      flex: 0.5,
    },
    {
      field: 'remiseMajoration',
      headerName: 'Remise/Majoration',
      width: 180,
      sortable: false,
      flex: 1,
      renderCell: (params) => `${params.value > 0 ? `${params.value}%` : '0'}`,
    },
    {
      field: 'totalTTCParProduit',
      headerName: 'Total TTC',
      type: 'number',
      width: 180,
      sortable: false,
      flex: 1,
      renderCell: (params) => formatPrice(Number(params.value)),
    },
  ]

  // Préparer les lignes pour les totaux en utilisant preparedData.totals
  const totalRows =
    preparedData && preparedData.totals
      ? [
          {
            id: 1,
            type: 'Total HT',
            amount: preparedData.totals.totalHT || '0',
          },
          {
            id: 2,
            type: 'Total TTC',
            amount: preparedData.totals.totalTTC || '0',
          },
          // Ajoutez ici d'autres lignes si nécessaire, par exemple, pour les ajustements
        ]
      : []

  const handleCheckboxChange = (event) => {
    setShowCustomerFields(event.target.checked)
  }

  const totalColumns = [
    { field: 'type', headerName: 'Type', width: 150, flex: 1 },
    {
      field: 'amount',
      headerName: 'Montant',
      width: 150,
      flex: 1,
      type: 'number',
      renderCell: (params) => formatPrice(Number(params.value)),
    },
  ]

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <div style={{ width: '100%', marginBottom: 5 }}>
          <DataGrid
            rows={preparedData.items || []}
            columns={columns}
            pageSize={5}
            hideFooter={true}
            disableColumnMenu={true}
          />
        </div>
        <div style={{ width: '35%', marginLeft: 'auto', marginRight: 0 }}>
          <DataGrid
            rows={totalRows}
            columns={totalColumns}
            hideFooter={true}
            disableColumnMenu={true}
            autoHeight={true}
            sx={{ '& .MuiDataGrid-columnHeaders': { display: 'none' } }}
          />
        </div>
        <FormControlLabel
          control={
            <Checkbox
              checked={showCustomerFields}
              onChange={handleCheckboxChange}
            />
          }
          label="Avec facture"
        />
        {showCustomerFields && (
          <>
            <TextField
              label="Nom du client"
              size="small"
              value={customerInfo.name}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, name: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email du client"
              size="small"
              value={customerInfo.email}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, email: e.target.value })
              }
              type="email"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Téléphone du client"
              size="small"
              value={customerInfo.phone}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, phone: e.target.value })
              }
              type="tel"
              fullWidth
              margin="normal"
            />
          </>
        )}
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="contained" onClick={handleAction}>
            {actionLabel}
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Annuler
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default ConfirmationModal
