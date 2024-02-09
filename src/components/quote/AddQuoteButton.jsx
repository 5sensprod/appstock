import React, { useContext } from 'react'
import { Button } from '@mui/material'
import { QuoteContext } from '../../contexts/QuoteContext'
import { CartContext } from '../../contexts/CartContext'

const AddQuoteButton = () => {
  const { addQuote } = useContext(QuoteContext)
  const { cartItems, cartTotals } = useContext(CartContext)

  const handleAddQuote = async () => {
    const quoteData = {
      items: cartItems.map((item) => ({
        reference: item.reference,
        quantity: item.quantity,
        prixHT: item.prixHT,
        prixTTC: item.prixTTC,
        tauxTVA: item.tauxTVA,
      })),
      totalHT: cartTotals.totalHT,
      totalTTC: cartTotals.totalTTC,
      date: new Date().toISOString(),
    }

    try {
      await addQuote(quoteData)
      alert('Devis ajouté avec succès!')
    } catch (error) {
      console.error("Erreur lors de l'ajout du devis:", error)
      alert("Erreur lors de l'ajout du devis.")
    }
  }

  return (
    <Button onClick={handleAddQuote} variant="outlined" color="primary">
      Ajouter Devis
    </Button>
  )
}

export default AddQuoteButton
