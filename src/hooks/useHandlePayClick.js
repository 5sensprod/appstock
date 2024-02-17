import { useContext } from 'react'
import { CartContext } from '../contexts/CartContext'
import { useInvoices } from '../contexts/InvoicesContext'
import { useProductContextSimplified } from '../contexts/ProductContextSimplified'

const useHandlePayClick = () => {
  const { cartItems, setCartItems, cartTotals, adjustmentAmount, clearCart } =
    useContext(CartContext)

  const { createInvoice } = useInvoices()
  const { updateProductStock } = useProductContextSimplified()

  const handlePayClick = async (paymentType, customerInfo) => {
    // Préparation des éléments de la facture à partir des articles du panier
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
      ...(item.prixModifie && { prixOriginal: item.prixVente }),
    }))

    const totalToUse =
      adjustmentAmount !== 0 ? cartTotals.modifiedTotal : cartTotals.totalTTC

    // Ajout des informations client à la data de la facture
    const newInvoiceData = {
      items: invoiceItems,
      totalHT: cartTotals.totalHT.toFixed(2),
      totalTVA: cartTotals.totalTaxes.toFixed(2),
      totalTTC: totalToUse.toFixed(2),
      adjustment: adjustmentAmount !== 0 ? adjustmentAmount.toFixed(2) : null,
      date: new Date().toISOString(),
      paymentType: paymentType,
      customerInfo: customerInfo,
    }

    try {
      const newInvoice = await createInvoice(newInvoiceData)
      console.log('Facture créée avec succès:', newInvoice)

      // Mise à jour du stock pour chaque article
      for (const item of cartItems) {
        await updateProductStock(item._id, item.quantity)
      }

      clearCart() // Nettoyage du panier après la création de la facture
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error)
    }
  }

  return handlePayClick
}

export default useHandlePayClick
