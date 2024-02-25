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
      reference: itemDetail.reference,
      quantity: itemDetail.quantite, // Notez l'utilisation de "quantite" correspondant à votre DB
      prixHT: itemDetail.puHT,
      prixTTC: itemDetail.puTTC,
      tauxTVA: itemDetail.tauxTVA,
      remiseMajoration: itemDetail.remiseMajorationLabel, // Utilisez "remiseMajorationLabel" pour déterminer si c'est une remise ou une majoration
      remiseMajorationValue: itemDetail.remiseMajorationValue,
      totalTTCParProduit: itemDetail.totalItem, // "totalItem" représente le total TTC par produit
    })) || []

  const columns = [
    {
      field: 'reference',
      headerName: 'Référence',
      width: 200,
      sortable: false,
      flex: 2,
    },
    {
      field: 'quantity',
      headerName: 'Qté',
      type: 'number',
      width: 80,
      sortable: false,
      flex: 0.4,
    },
    {
      field: 'prixHT',
      headerName: 'Prix HT',
      type: 'number',
      width: 130,
      flex: 0.6,
      renderCell: (params) => formatPrice(Number(params.value)),
    },
    {
      field: 'prixTTC',
      headerName: 'Prix TTC',
      type: 'number',
      width: 130,
      flex: 0.65,
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
      field: 'remiseMajorationValue', // Utilisez le champ qui contient la valeur de la remise ou de la majoration
      headerName: item?.remiseMajorationLabel
        ? item.remiseMajorationLabel
        : 'Rem./Maj.', // Choix dynamique du titre de la colonne
      width: 100,
      sortable: false,
      flex: 0.69,
      renderCell: (params) => {
        // Affichage conditionnel de la valeur de remise/majoration
        return params.value > 0 ? `${params.value}%` : '0'
      },
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
