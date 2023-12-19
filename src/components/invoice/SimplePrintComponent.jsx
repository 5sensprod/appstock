import React, { useContext } from 'react'
import { Button } from '@mui/material'
import { CartContext } from '../../contexts/CartContext'
import { fetchApi } from '../../api/axiosConfig' // Assurez-vous que le chemin d'importation est correct

const SimplePrintComponent = () => {
  const { invoiceData } = useContext(CartContext) // Utiliser useContext pour accéder à invoiceData

  const handlePrint = async () => {
    try {
      // Utiliser fetchApi pour envoyer les données de la facture au serveur
      const response = await fetchApi('generate-ticket', 'POST', invoiceData, {
        responseType: 'blob',
      })

      // Créer un objet URL pour le PDF reçu
      const file = new Blob([response], { type: 'application/pdf' })
      const fileURL = URL.createObjectURL(file)

      // Ouvrir le PDF dans un nouvel onglet pour l'impression
      window.open(fileURL)
    } catch (error) {
      console.error("Erreur lors de l'impression du ticket", error)
    }
  }

  return (
    <Button variant="contained" onClick={handlePrint}>
      Imprimer les détails de la facture
    </Button>
  )
}

export default SimplePrintComponent
