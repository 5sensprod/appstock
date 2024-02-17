import React, { useContext, useEffect, useState } from 'react'
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
import { CartContext } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/priceUtils'
import { useInvoices } from '../../contexts/InvoicesContext'
import { useUI } from '../../contexts/UIContext'
import { useQuotes } from '../../contexts/QuoteContext'
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
import useHandlePayClick from '../../hooks/useHandlePayClick'

const InvoiceConfirmationModal = ({ open, onClose }) => {
  const {
    cartItems,
    cartTotals,
    adjustmentAmount,
    clearCart,
    paymentType,
    amountPaid,
  } = useContext(CartContext)

  const { showToast } = useUI()

  const {
    customerName,
    customerEmail,
    customerPhone,
    isActiveQuote,
    deactivateQuote,
  } = useQuotes()

  const [preparedInvoiceData, setPreparedInvoiceData] = useState({
    items: [],
    totals: {},
  })

  const handlePayClick = useHandlePayClick()

  //   const { addTicket } = useTicketsContext() // Hypothétique
  const {
    prepareInvoiceData,
    createInvoice,
    // customerName,
    setCustomerName,
    // customerEmail,
    setCustomerEmail,
    // customerPhone,
    setCustomerPhone,
  } = useInvoices()

  const hasMajoration = cartItems.some(
    (item) =>
      item.remiseMajorationValue > 0 &&
      item.remiseMajorationLabel === 'Majoration',
  )

  const hasAdjustment = cartItems.some((item) => item.remiseMajorationValue > 0)

  const [showCustomerFields, setShowCustomerFields] = useState(false)

  useEffect(() => {
    // Supposons que prepareInvoiceData soit importé de InvoicesContext
    const invoiceData = prepareInvoiceData(
      cartItems,
      cartTotals,
      adjustmentAmount,
    )
    setPreparedInvoiceData(invoiceData)
  }, [cartItems, cartTotals, adjustmentAmount, prepareInvoiceData])

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

  // Colonnes pour la grille des totaux
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
  // Préparer les données pour la grille des totaux
  const totalRows = [
    {
      id: 1,
      type: 'Total HT',
      amount: preparedInvoiceData.totals.totalHT || '0',
    },
    {
      id: 2,
      type: 'Total TTC',
      amount: preparedInvoiceData.totals.totalTTC || '0',
    },
  ]

  if (adjustmentAmount !== 0) {
    const adjustmentType = adjustmentAmount > 0 ? 'Majoration' : 'Remise'
    const totalTTCAjusté =
      parseFloat(preparedInvoiceData.totals.totalTTC) + adjustmentAmount

    totalRows.push({
      id: totalRows.length + 1,
      type: adjustmentType,
      amount: Math.abs(adjustmentAmount).toFixed(2),
    })

    totalRows.push({
      id: totalRows.length + 1,
      type: 'Net à payer',
      amount: totalTTCAjusté.toFixed(2),
    })
  }

  const handleActionClick = async () => {
    try {
      if (showCustomerFields) {
        // Si showCustomerFields est vrai, cela signifie que l'utilisateur souhaite créer une facture.
        const customerInfo = {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
        }
        // Passer true pour isInvoice, indiquant que nous créons une facture
        await handlePayClick(paymentType, customerInfo, true) // true pour spécifier la création d'une facture
        showToast('La facture a été créée avec succès.', 'success')
        if (isActiveQuote) {
          deactivateQuote() // Désactiver le mode devis si actif
        }
      } else {
        // Sinon, nous traitons cela comme la création d'un ticket, donc pas besoin d'infos client.
        await handlePayClick(paymentType, {}, false) // false pour spécifier la création d'un ticket
        showToast('Le ticket a été validé avec succès.', 'success')
      }

      // Réinitialisation des états et fermeture du modal
      clearCart()
      setCustomerName('')
      setCustomerEmail('')
      setCustomerPhone('')
      setShowCustomerFields(false)
      onClose()
    } catch (error) {
      showToast(
        `Erreur lors de la création de la facture/ticket: ${error.message}`,
        'error',
      )
    }
  }

  const handleCheckboxChange = (event) => {
    setShowCustomerFields(event.target.checked)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          Confirmez la facture
        </Typography>
        <div style={{ width: '100%', marginBottom: 5 }}>
          <DataGrid
            rows={preparedInvoiceData.items || []}
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
          </>
        )}
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="contained" onClick={handleActionClick}>
            Valider
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Annuler
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default InvoiceConfirmationModal
