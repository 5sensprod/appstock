// src/components/ui/DetailsModal.jsx
import React from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import { useInvoices } from '../../contexts/InvoicesContext'
import { formatPrice } from '../../utils/priceUtils'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const DetailsModal = ({ open, onClose, invoiceId }) => {
  const { invoices } = useInvoices()

  // Trouver la facture spécifique par son ID ou une autre propriété
  const invoice = invoices.find((inv) => inv._id === invoiceId)

  // Préparer les rows pour DataGrid basé sur les items de la facture trouvée
  const rows =
    invoice?.items.map((item, index) => ({
      id: index,
      reference: item.reference,
      date: invoice.date,
      totalTTC: item.totalItem,
    })) || []

  const columns = [
    { field: 'reference', headerName: 'Référence', width: 200 },
    {
      field: 'date',
      headerName: 'Date',
      width: 150,
      valueFormatter: (params) => {
        // Formatage de la date. Assurez-vous que `params.value` est une instance de Date
        return new Date(params.value).toLocaleDateString('fr-FR')
      },
    },
    {
      field: 'totalTTC',
      headerName: 'Total TTC',
      width: 160,
      valueFormatter: ({ value }) => formatPrice(value),
    },
    // Ajoutez ici d'autres colonnes si nécessaire
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
