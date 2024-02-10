import React, { useContext, useEffect, useState } from 'react'
import { Modal, Box, Button, Typography, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { QuoteContext } from '../../contexts/QuoteContext'
import { CartContext } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/priceUtils'

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

const QuoteConfirmationModal = ({
  open,
  onClose,
  cartItems,
  cartTotals,
  adjustmentAmount,
}) => {
  const { addQuote } = useContext(QuoteContext)
  const { clearCart } = useContext(CartContext)
  const [preparedQuoteData, setPreparedQuoteData] = useState([])
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')

  // Préparez les données dès que cartItems ou cartTotals changent
  useEffect(() => {
    const items = cartItems.map((item, index) => ({
      id: index,
      reference: item.reference,
      quantity: item.quantity,
      prixHT: item.prixHT,
      tauxTVA: item.tauxTVA,
      totalTTCParProduit: (parseFloat(item.puTTC) * item.quantity).toFixed(2),
      remiseMajorationLabel: item.remiseMajorationLabel,
      remiseMajorationValue: item.remiseMajorationValue,
    }))
    const quoteData = {
      items,
      totalHT: cartTotals.totalHT,
      totalTTC: cartTotals.totalTTC,
    }
    setPreparedQuoteData(quoteData)
  }, [cartItems, cartTotals])

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
      flex: 1,
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
      field: 'tauxTVA',
      headerName: 'TVA',
      type: 'number',
      width: 130,
      sortable: false,
      flex: 1,
    },
    {
      field: 'remiseMajoration',
      headerName: 'Remise/Majoration',
      width: 180,
      sortable: false,
      flex: 1,
      renderCell: (params) => {
        // Assurez-vous que la remiseMajorationValue est traitée correctement comme un pourcentage
        const value = params.row.remiseMajorationValue
        const label = params.row.remiseMajorationLabel || 'Remise' // Utilisez un label par défaut si aucun n'est fourni
        return value > 0 ? `${label}: ${value}%` : 'N/A'
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
    { id: 1, type: 'Total HT', amount: preparedQuoteData.totalHT },
    { id: 2, type: 'Total TTC', amount: preparedQuoteData.totalTTC },
  ]

  // Vérifier si une remise/majoration globale est appliquée et l'ajouter aux lignes
  if (adjustmentAmount !== 0) {
    const adjustmentType = adjustmentAmount > 0 ? 'Majoration ' : 'Remise '
    const totalTTCAjusté =
      parseFloat(preparedQuoteData.totalTTC) + adjustmentAmount // Assurez-vous que cela correspond à votre logique d'ajustement

    // Ajouter une ligne pour le montant de la remise/majoration
    totalRows.push({
      id: totalRows.length + 1, // Assurer l'unicité de l'ID
      type: adjustmentType,
      amount: Math.abs(adjustmentAmount),
    })

    // Ajouter une ligne pour le Net à payer
    totalRows.push({
      id: totalRows.length + 1, // Assurer l'unicité de l'ID après l'ajout précédent
      type: 'Net à payer',
      amount: totalTTCAjusté,
    })
  }

  const handleConfirm = async () => {
    const quoteDataWithCustomerInfo = {
      ...preparedQuoteData,
      customerInfo: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
    }

    try {
      await addQuote(quoteDataWithCustomerInfo)
      alert('Devis ajouté avec succès!')
      onClose()
      clearCart()
      setCustomerName('')
      setCustomerEmail('')
      setCustomerPhone('')
    } catch (error) {
      console.error("Erreur lors de l'ajout du devis:", error)
      alert("Erreur lors de l'ajout du devis.")
    }
  }

  const resetFormAndCloseModal = () => {
    // Réinitialiser les informations du client
    setCustomerName('')
    setCustomerEmail('')
    setCustomerPhone('')

    // Optionnel: clearCart(); Si vous souhaitez également vider le panier lors de l'annulation

    onClose() // Utilisez la fonction de fermeture existante pour fermer la modal
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
            onClick={handleConfirm}
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
