import { useContext, useState } from 'react'
import { CartContext } from '../../contexts/CartContext'

const usePaymentHandlers = () => {
  const {
    paymentType,
    setPaymentType,
    amountPaid,
    setAmountPaid,
    cartTotals,
    adjustmentAmount,
  } = useContext(CartContext)

  // Ajout de l'état pour gérer les paiements multiples
  const [multiplePayments, setMultiplePayments] = useState([])

  const handlePaymentTypeChange = (event) => {
    setPaymentType(event.target.value)
  }

  const handleAmountPaidChange = (event) => {
    setAmountPaid(event.target.value)
  }

  const addMultiplePayments = (payment) => {
    setMultiplePayments((prevPayments) => [...prevPayments, payment])
  }

  const calculateChange = () => {
    const total =
      adjustmentAmount !== 0
        ? cartTotals.modifiedTotal
        : cartTotals.originalTotal
    const paid = parseFloat(amountPaid)
    const change = paid > total ? paid - total : 0
    return change
  }

  // Calcul du montant restant à payer
  const calculateRemainingAmount = () => {
    const total =
      adjustmentAmount !== 0
        ? cartTotals.modifiedTotal
        : cartTotals.originalTotal
    const totalPaid = multiplePayments.reduce(
      (acc, payment) => acc + payment.amount,
      0,
    )
    return total - totalPaid
  }

  const removePayment = (index) => {
    setMultiplePayments((prevPayments) =>
      prevPayments.filter((_, i) => i !== index),
    )
  }

  const updatePayment = (index, newPayment) => {
    setMultiplePayments((prevPayments) =>
      prevPayments.map((payment, i) => (i === index ? newPayment : payment)),
    )
  }

  return {
    handlePaymentTypeChange,
    handleAmountPaidChange,
    calculateChange,
    addMultiplePayments,
    calculateRemainingAmount,
    paymentType,
    amountPaid,
    multiplePayments,
    removePayment,
    updatePayment,
  }
}

export default usePaymentHandlers
