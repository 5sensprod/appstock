import React from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import { useInvoices } from '../../contexts/InvoicesContext'
import { formatPrice } from '../../utils/priceUtils'
import Typography from '@mui/material/Typography'

const DetailsModal = ({ open, onClose, itemId, itemType }) => {
  const { invoices, tickets } = useInvoices()

  let item
  if (itemType === 'invoice') {
    item = invoices.find((inv) => inv._id === itemId)
  } else if (itemType === 'ticket') {
    item = tickets.find((ticket) => ticket._id === itemId)
  }

  // Formatage de la date pour l'affichage
  const formattedDate = item
    ? new Date(item.date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : ''

  // Construire le titre avec le numéro et la date
  const modalTitle = `${itemType === 'invoice' ? 'Facture' : 'Ticket'} n°${itemType === 'invoice' ? item?.invoiceNumber : item?.ticketNumber} - ${formattedDate}`

  const rows =
    item?.items.map((itemDetail, index) => ({
      id: index,
      reference: itemDetail.reference || itemDetail.ticketNumber,
      date: item.date,
      totalTTC: itemDetail.totalItem || itemDetail.totalTTC,
    })) || []

  const columns = [
    {
      field: 'reference',
      headerName: 'Référence',
      width: 150,
      sortable: false,
      flex: 1,
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 150,
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString('fr-FR'),
    },
    {
      field: 'totalTTC',
      headerName: 'Total TTC',
      width: 160,
      valueFormatter: ({ value }) => formatPrice(value),
    },
  ]

  const totalsRows = item
    ? [
        {
          id: 'totalHT',
          label: 'Total HT',
          value: item.totalHT,
          width: 150,
          flex: 1,
        },
        {
          id: 'totalTVA',
          label: 'Total TVA',
          value: item.totalTVA,
          width: 150,
          flex: 1,
        },
        {
          id: 'totalTTC',
          label: 'Total TTC',
          value: item.totalTTC,
          width: 150,
          flex: 1,
        },
      ]
    : []
  const totalsColumns = [
    { field: 'label', headerName: 'Label', width: 150, flex: 1 },
    {
      field: 'value',
      headerName: 'Valeur',
      width: 150,
      flex: 1,
      valueFormatter: ({ value }) => formatPrice(value), // Utilisez formatPrice pour formater les valeurs monétaires
    },
  ]

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography
          id="modal-modal-title"
          variant="h5"
          component="h2"
          sx={{ mb: 2 }}
        >
          {modalTitle}
        </Typography>
        <div style={{ width: '100%', marginBottom: 5 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            hideFooter={true}
            disableColumnMenu={true}
          />
        </div>
        <div style={{ width: '35%', marginLeft: 'auto', marginRight: 0 }}>
          <DataGrid
            rows={totalsRows}
            columns={totalsColumns}
            hideFooter={true}
            disableColumnMenu={true}
            autoHeight={true}
            sx={{ '& .MuiDataGrid-columnHeaders': { display: 'none' } }}
          />
        </div>
      </Box>
    </Modal>
  )
}

export default DetailsModal
