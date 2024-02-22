import React, { useContext, useEffect, useState } from 'react'
import { Modal, Box, Button, Typography, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { QuoteContext } from '../../contexts/QuoteContext'
import { CartContext } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/priceUtils'
import { useUI } from '../../contexts/UIContext'
import { useNavigate } from 'react-router-dom'

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

const QuoteConfirmationModal = ({ open, onClose }) => {
  const {
    addQuote,
    customerName,
    setCustomerName,
    customerEmail,
    setCustomerEmail,
    customerPhone,
    setCustomerPhone,
    prepareQuoteData,
  } = useContext(QuoteContext)

  const { cartItems, cartTotals, adjustmentAmount, clearCart } =
    useContext(CartContext)
  const [preparedQuoteData, setPreparedQuoteData] = useState([])

  const hasMajoration = cartItems.some(
    (item) =>
      item.remiseMajorationValue > 0 &&
      item.remiseMajorationLabel === 'Majoration',
  )

  const hasAdjustment = cartItems.some((item) => item.remiseMajorationValue > 0)
  const { showToast } = useUI()
  const navigate = useNavigate()

  useEffect(() => {
    const quoteData = prepareQuoteData(cartItems, cartTotals, adjustmentAmount)
    setPreparedQuoteData(quoteData)
  }, [cartItems, cartTotals, adjustmentAmount, prepareQuoteData])

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
      headerName: hasMajoration ? 'Majoration' : 'Remise', // Choix dynamique basé sur la présence de majorations
      width: 180,
      sortable: false,
      flex: 1,
      renderCell: (params) => {
        const value = params.row.remiseMajorationValue
        return value > 0 ? `${value}%` : '0'
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

  const totalColumns = [
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      flex: 1,
    },
    {
      field: 'amount',
      headerName: 'Montant',
      width: 150,
      flex: 1,
      type: 'number',
      renderCell: (params) => formatPrice(Number(params.value)),
    },
  ]

  const totalRows = [
    { id: 1, type: 'Total HT', amount: preparedQuoteData.totalHT },
    { id: 2, type: 'Total TTC', amount: preparedQuoteData.totalTTC },
  ]

  if (adjustmentAmount !== 0) {
    const adjustmentType = adjustmentAmount > 0 ? 'Majoration ' : 'Remise '
    const totalTTCAjusté =
      parseFloat(preparedQuoteData.totalTTC) + adjustmentAmount

    totalRows.push({
      id: totalRows.length + 1,
      type: adjustmentType,
      amount: Math.abs(adjustmentAmount),
    })

    totalRows.push({
      id: totalRows.length + 1,
      type: 'Net à payer',
      amount: totalTTCAjusté,
    })
  }

  const resetFormAndCloseModal = () => {
    setCustomerName('')
    setCustomerEmail('')
    setCustomerPhone('')

    onClose()
  }

  const handleSubmitQuote = async () => {
    if (!customerName && !customerEmail && !customerPhone) {
      showToast(
        'Veuillez fournir au moins une information de contact pour le client.',
        'error',
      )
      return
    }

    const quoteData = prepareQuoteData(cartItems, cartTotals, adjustmentAmount)
    quoteData.customerInfo = {
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
    }

    try {
      await addQuote(quoteData)
      showToast('Devis ajouté avec succès.', 'success')
      onClose()
      clearCart()
      navigate('/dashboard#les-devis')
    } catch (error) {
      showToast(`Erreur lors de l'ajout du devis: ${error.message}`, 'error')
    }
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          ...style,
          maxHeight: '800px',
          overflowY: 'auto',
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2">
          Confirmez le devis
        </Typography>
        <div style={{ width: '100%', marginBottom: 5 }}>
          <DataGrid
            rows={preparedQuoteData.items || []}
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
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                display: 'none',
              },
            }}
          />
        </div>
        {!customerName && !customerEmail && !customerPhone && (
          <Typography variant="body2" mt={2}>
            Veuillez renseigner au moins un des champs suivants.
          </Typography>
        )}
        <TextField
          label="Nom du client"
          size="small"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Email du client"
          size="small"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          type="email"
          fullWidth
          margin="normal"
        />

        <TextField
          label="Téléphone du client"
          size="small"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          type="tel"
          fullWidth
          margin="normal"
        />
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            onClick={handleSubmitQuote}
            disabled={!customerName && !customerEmail && !customerPhone}
          >
            Valider
          </Button>
          <Button variant="outlined" onClick={resetFormAndCloseModal}>
            Annuler
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default QuoteConfirmationModal
