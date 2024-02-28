import { useContext } from 'react'
import { CartContext } from '../../contexts/CartContext'

const usePaymentHandlers = () => {
  const {
    paymentType,
    setPaymentType,
    amountPaid,
    setAmountPaid,
    cartTotals,
    adjustmentAmount,
    multiplePayments,
    setMultiplePayments,
    paymentDetails,
    setPaymentDetails,
  } = useContext(CartContext)

  const handlePaymentTypeChange = (event) => {
    setPaymentType(event.target.value)
  }

  const handleAmountPaidChange = (event) => {
    setAmountPaid(event.target.value)
  }

  const addPaymentDetails = (payment) => {
    setMultiplePayments((prevDetails) => [...prevDetails, payment])
    setPaymentDetails((prevDetails) => {
      const newDetails = [...prevDetails, payment]
      console.log('Payment Details Updated: ', newDetails) // Vérification
      return newDetails
    })
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
    addPaymentDetails,
    calculateRemainingAmount,
    paymentType,
    amountPaid,
    multiplePayments,
    removePayment,
    updatePayment,
  }
}

export default usePaymentHandlers
