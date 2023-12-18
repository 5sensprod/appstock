// useHandlePayClick.js
import { useContext } from 'react'
import { CartContext } from '../contexts/CartContext'
import { addInvoice } from '../api/invoiceService'

const useHandlePayClick = () => {
  const {
    cartItems,
    setCartItems,
    setIsModalOpen,
    setInvoiceData,
    cartTotals,
    adjustmentAmount,
  } = useContext(CartContext)

  const handlePayClick = async (paymentType) => {
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

    const totalToUse =
      adjustmentAmount !== 0 ? cartTotals.modifiedTotal : cartTotals.totalTTC

    // Créez un nouvel objet de données de facture pour l'envoyer
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
      const newInvoice = await addInvoice(newInvoiceData)
      console.log('New invoice added:', newInvoice)
      setInvoiceData(newInvoice)
      setCartItems([])
      setIsModalOpen(true)
    } catch (error) {
      console.error('An error occurred while adding the invoice:', error)
    }
  }

  return handlePayClick
}

export default useHandlePayClick
