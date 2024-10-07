import React, { useContext, useEffect, useState } from 'react'
import {
  Modal,
  Box,
  Button,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Grid,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { CartContext } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/priceUtils'
import { useInvoices } from '../../contexts/InvoicesContext'
import { useUI } from '../../contexts/UIContext'
import { useQuotes } from '../../contexts/QuoteContext'
import PaymentTypeSelector from '../Cart/PaymentTypeSelector'
import { sendMessage } from '../../websocketClient'

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
  maxHeight: '80vh',
  overflowY: 'auto',
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
    resetPaymentInfo,
    editingPayment,
    calculateRemainingAmount,
    multiplePayment,
    calculateChange,
    setHasChanges,
    displayThankYouMessage,
  } = useContext(CartContext)

  const { showToast } = useUI()

  const remainingAmount = calculateRemainingAmount()

  const isMultiplePaymentIncomplete =
    paymentType === 'Multiple' && remainingAmount > 0

  const isCashPaymentInsufficient =
    paymentType === 'Cash' && (!amountPaid || calculateChange() < 0)

  const disableValidationButton =
    editingPayment.index !== null ||
    isMultiplePaymentIncomplete ||
    isCashPaymentInsufficient

  const {
    customerName: quoteCustomerName,
    customerAdress: quoteCustomerAdress,
    customerEmail: quoteCustomerEmail,
    customerPhone: quoteCustomerPhone,
    isActiveQuote,
    deactivateQuote,
  } = useQuotes()

  const [customerName, setCustomerName] = useState(quoteCustomerName || '')
  const [customerAdress, setCustomerAdress] = useState(
    quoteCustomerAdress || '',
  )
  const [customerEmail, setCustomerEmail] = useState(quoteCustomerEmail || '')
  const [customerPhone, setCustomerPhone] = useState(quoteCustomerPhone || '')

  const [preparedInvoiceData, setPreparedInvoiceData] = useState({
    items: [],
    totals: {},
  })

  const [shouldPrint, setShouldPrint] = useState(true)

  const handlePayClick = useHandlePayClick()

  const { prepareInvoiceData } = useInvoices()

  const hasMajoration = cartItems.some(
    (item) =>
      item.remiseMajorationValue > 0 &&
      item.remiseMajorationLabel === 'Majoration',
  )

  const [showCustomerFields, setShowCustomerFields] = useState(false)

  useEffect(() => {
    const invoiceData = prepareInvoiceData(
      cartItems,
      cartTotals,
      adjustmentAmount,
    )
    setPreparedInvoiceData(invoiceData)
  }, [cartItems, cartTotals, adjustmentAmount, prepareInvoiceData])

  useEffect(() => {
    if (isActiveQuote) {
      setCustomerName(quoteCustomerName)
      setCustomerEmail(quoteCustomerEmail)
      setCustomerPhone(quoteCustomerPhone)
    }
  }, [quoteCustomerName, quoteCustomerEmail, quoteCustomerPhone, isActiveQuote])

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
      headerName: 'Qté',
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
      headerName: hasMajoration ? 'Majoration' : 'Remise',
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
      const customerInfo = {
        name: customerName,
        adress: customerAdress,
        email: customerEmail,
        phone: customerPhone,
      }

      // Lorsque "Avec facture" est coché, imprimez un ticket vide pour ouvrir le tiroir-caisse
      // sans imprimer de ticket ou facture détaillé(e).
      if (showCustomerFields) {
        if (!customerName || !customerAdress) {
          showToast('Veuillez remplir tous les champs obligatoires.', 'error')
          return
        }

        // Même si "Avec facture" est coché, on appelle handlePayClick avec shouldPrint défini sur false
        // et un paramètre supplémentaire pour indiquer qu'un ticket vide doit être imprimé.
        await handlePayClick(
          paymentType,
          customerInfo,
          true, // isInvoice
          false, // shouldPrint, forcé à faux car "Avec facture" est coché
          true, // Indique que nous voulons imprimer un ticket vide
        )
        showToast('La facture a été créée avec succès.', 'success')
      } else {
        // Pour les ventes sans facture, on suit la préférence de l'utilisateur concernant l'impression du ticket.
        await handlePayClick(
          paymentType,
          {}, // Aucune info client pour un ticket
          false, // isInvoice
          shouldPrint, // Utilise la préférence de l'utilisateur
          !shouldPrint, // Imprime un ticket vide si l'utilisateur choisit de ne pas imprimer
        )
        showToast('Le ticket a été validé avec succès.', 'success')
      }

      // Appeler la fonction pour afficher le message "Merci, À bientôt !" sur l'écran LCD
      displayThankYouMessage()
      sendMessage({ type: 'DISPLAY_THANK_YOU_MESSAGE' })
      // Réinitialisation de l'état et fermeture du modal
      clearCart()
      setCustomerName('')
      setCustomerEmail('')
      setCustomerPhone('')
      setCustomerAdress('')
      setShowCustomerFields(false)
      resetPaymentInfo()
      setHasChanges(false)
      deactivateQuote()
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
        <Typography id="modal-title" variant="h6" component="h2" mb={2}>
          Confirmer la vente
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
        <Box mb={1}>
          <FormControlLabel
            control={
              <Checkbox
                checked={showCustomerFields}
                onChange={handleCheckboxChange}
                size="small"
              />
            }
            label="Avec facture"
          />
        </Box>
        {showCustomerFields && (
          <Box mb={3}>
            {/* Message d'erreur */}
            {!customerName && !customerAdress && (
              <Typography variant="body2" mb={2}>
                Les champs marqués d'un astérisque (*) sont obligatoires.
              </Typography>
            )}

            {/* Champ "Nom du client" */}
            <Grid container spacing={2} margin="normal">
              <Grid item xs={4}>
                <TextField
                  label="Nom du client *"
                  size="small"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  label="Adresse du client *"
                  size="small"
                  value={customerAdress}
                  onChange={(e) => setCustomerAdress(e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container spacing={1} margin="normal" mt={1} mb={1}>
              <Grid item xs={6}>
                <TextField
                  label="Email du client"
                  size="small"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  type="email"
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Téléphone du client"
                  size="small"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  type="tel"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        )}
        <Box mt={2}>
          <PaymentTypeSelector isActiveQuote={isActiveQuote} />
        </Box>
        {!showCustomerFields && (
          <>
            <Checkbox
              checked={shouldPrint}
              onChange={(e) => setShouldPrint(e.target.checked)}
              color="primary"
            />
            <label>Imprimer le ticket</label>
          </>
        )}
        <Box mt={4} display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            onClick={handleActionClick}
            disabled={disableValidationButton}
          >
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
