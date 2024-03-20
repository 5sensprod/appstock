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

  const { createInvoice, createTicket, handleIncrementPdfGenerationCount } =
    useInvoices()
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
      let documentType

      if (isInvoice) {
        responseData = await createInvoice(data)
        documentType = 'invoice'
        console.log('Facture créée avec succès. ID:', responseData._id)
      } else {
        responseData = await createTicket(data)
        documentType = 'ticket'
        console.log('Ticket créé avec succès. ID:', responseData._id)
      }

      // Appeler printTicket si nécessaire
      if (shouldPrint && responseData) {
        await printTicket(responseData, documentType)
        await handleIncrementPdfGenerationCount(responseData._id, documentType) // Incrémenter le compteur de génération de PDF
      }

      // Mise à jour du stock et nettoyage du panier...
      cartItems.forEach(async (item) => {
        await updateProductStock(item._id, item.quantity)
      })
      clearCart()
    } catch (error) {
      console.error(`Erreur lors de la création du document:`, error)
    }
  }

  return handlePayClick
}

export default useHandlePayClick
