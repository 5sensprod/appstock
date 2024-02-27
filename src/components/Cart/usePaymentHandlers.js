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
  } = useContext(CartContext)

  const handlePaymentTypeChange = (event) => {
    setPaymentType(event.target.value)
  }

  const handleAmountPaidChange = (event) => {
    setAmountPaid(event.target.value)
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

  return {
    handlePaymentTypeChange,
    handleAmountPaidChange,
    calculateChange,
    paymentType,
    amountPaid,
  }
}

export default usePaymentHandlers
