import { useContext } from 'react'
import { CartContext } from '../../contexts/CartContext'

const usePaymentHandlers = () => {
  const {
    paymentType,
    setPaymentType,
    amountPaid,
    setAmountPaid,
    multiplePayments,
    setMultiplePayments,
    setPaymentDetails,
    setCashDetails,
    calculateChange,
  } = useContext(CartContext)

  const handlePaymentTypeChange = (event) => {
    setPaymentType(event.target.value)
  }

  const handleAmountPaidChange = (event) => {
    const value = event.target.value
    // Utiliser une chaîne vide si la valeur est falsy (y compris une chaîne vide), sinon convertir en nombre
    const givenAmount = value ? parseFloat(value) : ''
    setAmountPaid(givenAmount)

    if (paymentType === 'Cash') {
      // Gérer uniquement les montants valides
      const changeAmount = givenAmount ? calculateChange(givenAmount) : 0
      setCashDetails({ givenAmount, changeAmount })
    }
  }

  const addPaymentDetails = (payment) => {
    setMultiplePayments((prevDetails) => [...prevDetails, payment])
    setPaymentDetails((prevDetails) => {
      const newDetails = [...prevDetails, payment]
      return newDetails
    })
  }

  const removePayment = (index) => {
    setMultiplePayments((prevPayments) =>
      prevPayments.filter((_, i) => i !== index),
    )

    // Mettre à jour paymentDetails en conséquence
    setPaymentDetails((prevDetails) =>
      prevDetails.filter((_, i) => i !== index),
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
    addPaymentDetails,
    paymentType,
    amountPaid,
    multiplePayments,
    removePayment,
    updatePayment,
  }
}

export default usePaymentHandlers
