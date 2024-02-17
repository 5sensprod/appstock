import { useContext } from 'react'
import { CartContext } from '../contexts/CartContext'
import { useInvoices } from '../contexts/InvoicesContext'
import { useProductContextSimplified } from '../contexts/ProductContextSimplified'
import { addTicket } from '../api/ticketService' // Assurez-vous que cette fonction existe et est correctement implémentée

const useHandlePayClick = () => {
  const { cartItems, cartTotals, adjustmentAmount, clearCart } =
    useContext(CartContext)
  const { createInvoice } = useInvoices()
  const { updateProductStock } = useProductContextSimplified()

  const handlePayClick = async (paymentType, customerInfo, isInvoice) => {
    // Préparation des éléments de la facture ou du ticket à partir des articles du panier
    const documentItems = cartItems.map((item) => ({
      reference: item.reference,
      quantite: item.quantity,
      puHT: item.prixHT,
      puTTC: item.puTTC,
      tauxTVA: item.tauxTVA,
      totalItem: item.totalItem,
      montantTVA: item.montantTVA,
      remiseMajorationLabel: item.remiseMajorationLabel,
      remiseMajorationValue: item.remiseMajorationValue,
      ...(item.prixModifie && { prixOriginal: item.prixVente }),
    }))

    const totalToUse =
      adjustmentAmount !== 0 ? cartTotals.modifiedTotal : cartTotals.totalTTC
    const date = new Date().toISOString()

    if (isInvoice) {
      // Création d'une facture
      const newInvoiceData = {
        items: documentItems,
        totalHT: cartTotals.totalHT.toFixed(2),
        totalTVA: cartTotals.totalTaxes.toFixed(2),
        totalTTC: totalToUse.toFixed(2),
        adjustment: adjustmentAmount !== 0 ? adjustmentAmount.toFixed(2) : null,
        date,
        paymentType,
        customerInfo,
      }

      try {
        const newInvoice = await createInvoice(newInvoiceData)
        console.log('Facture créée avec succès:', newInvoice)
      } catch (error) {
        console.error('Erreur lors de la création de la facture:', error)
      }
    } else {
      // Création d'un ticket
      const newTicketData = {
        items: documentItems,
        totalHT: cartTotals.totalHT.toFixed(2),
        totalTVA: cartTotals.totalTaxes.toFixed(2),
        totalTTC: totalToUse.toFixed(2),
        adjustment: adjustmentAmount !== 0 ? adjustmentAmount.toFixed(2) : null,
        date,
        paymentType, // Note: Vous pouvez choisir de ne pas inclure paymentType ou customerInfo pour les tickets selon votre logique métier.
      }

      try {
        const newTicket = await addTicket(newTicketData)
        console.log('Ticket créé avec succès:', newTicket)
      } catch (error) {
        console.error('Erreur lors de la création du ticket:', error)
      }
    }

    // Mise à jour du stock pour chaque article
    for (const item of cartItems) {
      await updateProductStock(item._id, item.quantity)
    }

    clearCart() // Nettoyage du panier après la création du document
  }

  return handlePayClick
}

export default useHandlePayClick
