import React from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import { useInvoices } from '../../contexts/InvoicesContext'
import { formatPrice } from '../../utils/priceUtils'

const DetailsModal = ({ open, onClose, itemId, itemType }) => {
  const { invoices, tickets } = useInvoices()

  let item
  if (itemType === 'invoice') {
    item = invoices.find((inv) => inv._id === itemId)
  } else if (itemType === 'ticket') {
    item = tickets.find((ticket) => ticket._id === itemId)
  }

  const rows =
    item?.items.map((itemDetail, index) => ({
      id: index,
      reference: itemDetail.reference || itemDetail.ticketNumber,
      date: item.date,
      totalTTC: itemDetail.totalItem || itemDetail.totalTTC,
    })) || []

  const columns = [
    { field: 'reference', headerName: 'Référence', width: 200 },
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
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </Box>
    </Modal>
  )
}

export default DetailsModal
