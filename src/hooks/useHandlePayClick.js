import { useContext } from 'react'
import { CartContext } from '../contexts/CartContext'
import { useInvoices } from '../contexts/InvoicesContext'
import { useProductContextSimplified } from '../contexts/ProductContextSimplified'

const useHandlePayClick = () => {
  const { cartItems, cartTotals, adjustmentAmount, clearCart } =
    useContext(CartContext)
  const { createInvoice, createTicket } = useInvoices() // Utilisation de createTicket ici
  const { updateProductStock } = useProductContextSimplified()

  const handlePayClick = async (paymentType, customerInfo, isInvoice) => {
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
      const newTicketData = {
        items: documentItems,
        totalHT: cartTotals.totalHT.toFixed(2),
        totalTVA: cartTotals.totalTaxes.toFixed(2),
        totalTTC: totalToUse.toFixed(2),
        adjustment: adjustmentAmount !== 0 ? adjustmentAmount.toFixed(2) : null,
        date,
        paymentType,
      }

      try {
        const newTicket = await createTicket(newTicketData)
        console.log('Ticket créé avec succès:', newTicket)
      } catch (error) {
        console.error('Erreur lors de la création du ticket:', error)
      }
    }

    for (const item of cartItems) {
      await updateProductStock(item._id, item.quantity)
    }

    clearCart() // Nettoyage du panier après la création du document
  }

  return handlePayClick
}

export default useHandlePayClick
