import { useContext } from 'react'
import { CartContext } from '../contexts/CartContext'
import { useInvoices } from '../contexts/InvoicesContext'
import { useProductContextSimplified } from '../contexts/ProductContextSimplified'
import { printTicket } from '../components/ticket/printTicket'

const useHandlePayClick = () => {
  const {
    cartItems,
    cartTotals,
    adjustmentAmount,
    clearCart,
    paymentDetails,
    cashDetails,
    calculateRemainingAmount,
  } = useContext(CartContext)

  const { createInvoice, createTicket } = useInvoices()
  const { updateProductStock } = useProductContextSimplified()

  const handlePayClick = async (
    paymentType,
    customerInfo,
    isInvoice,
    shouldPrint,
  ) => {
    const documentItems = cartItems.map((item) => ({
      reference: item.reference,
      id: item._id,
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

    const rawRemainingAmount = calculateRemainingAmount()
    // Arrondir à deux décimales et convertir en nombre
    const remainingAmount = parseFloat(rawRemainingAmount.toFixed(2))

    const baseData = {
      items: documentItems,
      totalHT: cartTotals.totalHT.toFixed(2),
      totalTVA: cartTotals.totalTaxes.toFixed(2),
      totalTTC: totalToUse.toFixed(2),
      adjustment: adjustmentAmount !== 0 ? adjustmentAmount.toFixed(2) : null,
      date,
      paymentDetails,
      cashDetails,
      ...(remainingAmount < 0 && { remainingAmount }),
    }

    const data = {
      ...baseData,
      paymentType,
      ...(isInvoice && { customerInfo }),
    }

    try {
      let responseData
      if (isInvoice) {
        responseData = await createInvoice(data)
        console.log('Facture créée avec succès. ID:', responseData)
      } else {
        responseData = await createTicket(data)
        console.log('Ticket créé avec succès. ID:', responseData)
      }

      if (shouldPrint && responseData) {
        // Vérifiez si shouldPrint est vrai avant d'appeler printTicket
        printTicket(responseData)
      }
    } catch (error) {
      console.error(`Erreur lors de la création du document:`, error)
    }

    // Mise à jour du stock et nettoyage du panier
    cartItems.forEach(async (item) => {
      await updateProductStock(item._id, item.quantity)
    })
    clearCart()
  }

  return handlePayClick
}

export default useHandlePayClick
