import React, { useContext, useEffect, useState } from 'react'
import { Modal, Box, Button, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { QuoteContext } from '../../contexts/QuoteContext'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const QuoteConfirmationModal = ({ open, onClose, cartItems, cartTotals }) => {
  const { addQuote } = useContext(QuoteContext)
  const [preparedQuoteData, setPreparedQuoteData] = useState([])

  // Préparez les données dès que cartItems ou cartTotals changent
  useEffect(() => {
    const items = cartItems.map((item, index) => ({
      id: index,
      reference: item.reference,
      quantity: item.quantity,
      prixHT: item.prixHT,
      tauxTVA: item.tauxTVA,
    }))
    const quoteData = {
      items: items,
      totalHT: cartTotals.totalHT,
      totalTTC: cartTotals.totalTTC,
    }
    setPreparedQuoteData(quoteData)
  }, [cartItems, cartTotals])

  const columns = [
    { field: 'reference', headerName: 'Référence', width: 150 },
    { field: 'quantity', headerName: 'Quantité', type: 'number', width: 110 },
    { field: 'prixHT', headerName: 'Prix HT', type: 'number', width: 130 },
    { field: 'tauxTVA', headerName: 'Taux TVA', type: 'number', width: 130 },
    // Ajoutez d'autres colonnes si nécessaire
  ]

  const handleConfirm = async () => {
    try {
      await addQuote(preparedQuoteData) // Utilisez addQuote pour sauvegarder dans la base de données
      alert('Devis ajouté avec succès!')
      onClose() // Fermez la modal
    } catch (error) {
      console.error("Erreur lors de l'ajout du devis:", error)
      alert("Erreur lors de l'ajout du devis.")
    }
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
          Confirmez le devis
        </Typography>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={preparedQuoteData.items || []}
            columns={columns}
            pageSize={5}
          />
        </div>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="contained" onClick={handleConfirm}>
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

export default QuoteConfirmationModal
