import { useContext } from 'react'
import { CartContext } from '../contexts/CartContext'
import { useInvoices } from '../contexts/InvoicesContext'
import { useQuotes } from '../contexts/QuoteContext'
import { useProductContextSimplified } from '../contexts/ProductContextSimplified'

const useHandlePayClick = () => {
  const {
    cartItems,
    setCartItems,
    setIsModalOpen,
    setInvoiceData,
    cartTotals,
    adjustmentAmount,
  } = useContext(CartContext)

  const { deactivateQuote } = useQuotes()
  const { updateProductInContext, updateProductStock } =
    useProductContextSimplified()

  const { createInvoice } = useInvoices()

  const handlePayClick = async (paymentType) => {
    console.log('Début du processus de paiement')

    // Log des articles du panier pour vérifier les données
    console.log('Articles du panier au moment du paiement:', cartItems)

    const invoiceItems = cartItems.map((item) => ({
      reference: item.reference,
      quantite: item.quantity,
      puHT: item.prixHT,
      puTTC: item.puTTC,
      tauxTVA: item.tauxTVA,
      totalItem: item.totalItem,
      montantTVA: item.montantTVA,
      remiseMajorationLabel: item.remiseMajorationLabel,
      remiseMajorationValue: item.remiseMajorationValue,
      ...(item.prixModifie && {
        prixOriginal: item.prixVente,
      }),
    }))

    // Log des articles formatés pour la facture
    console.log('Articles formatés pour la facture:', invoiceItems)

    const totalToUse =
      adjustmentAmount !== 0 ? cartTotals.modifiedTotal : cartTotals.totalTTC

    const newInvoiceData = {
      items: invoiceItems,
      totalHT: cartTotals.totalHT.toFixed(2),
      totalTVA: cartTotals.totalTaxes.toFixed(2),
      totalTTC: totalToUse.toFixed(2),
      adjustment: adjustmentAmount !== 0 ? adjustmentAmount.toFixed(2) : null,
      date: new Date().toISOString(),
      paymentType,
    }

    try {
      const newInvoice = await createInvoice(newInvoiceData)
      console.log('Facture créée avec succès:', newInvoice)

      // Log spécifique pour la mise à jour du stock
      for (const item of cartItems) {
        await updateProductStock(item._id, item.quantity)
      }

      setInvoiceData(newInvoice)
      setCartItems([])
      setIsModalOpen(true)
      deactivateQuote()
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de l'ajout de la facture:",
        error,
      )
    }
  }

  return handlePayClick
}

export default useHandlePayClick
