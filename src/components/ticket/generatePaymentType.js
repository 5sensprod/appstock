// Fonction pour obtenir la désignation lisible du type de paiement
const getReadablePaymentType = (type) => {
  switch (type) {
    case 'CB':
      return 'Carte Bancaire'
    case 'Cash':
      return 'Espèces'
    case 'Cheque':
      return 'Chèque'
    case 'ChequeCadeau':
      return 'Chèque Cadeau'
    case 'Virement':
      return 'Virement'
    case 'Avoir':
      return 'Avoir'
    default:
      return type
  }
}

// Fonction pour formater les montants
const formatAmount = (amount) => {
  return parseFloat(amount).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// Générer le détail de paiement sous forme de ligne HTML
const generatePaymentDetail = (label, value, fontSize = '12px') => {
  return `
  <div style="display: flex; justify-content: space-between; align-items: center; font-size: ${fontSize};">
    <span style="font-weight: normal;">${label} :</span>
    <span style="font-weight: normal;">${value} €</span>
  </div>
`
}

// Fonction principale pour générer les détails de paiement
export const generatePaymentType = ({
  paymentType,
  cashDetails = {},
  paymentDetails = [],
  totalTTC,
  remainingAmount,
  fontSize = '12px',
}) => {
  let paymentContent = '<div style="margin-top: 20px;">'

  const details = [
    ...(paymentType === 'Cash'
      ? [
          {
            label: getReadablePaymentType(paymentType),
            value: formatAmount(cashDetails.givenAmount),
          },
          ...(cashDetails.changeAmount !== undefined
            ? [
                {
                  label: 'Rendu',
                  value: formatAmount(cashDetails.changeAmount),
                },
              ]
            : []),
        ]
      : []),
    ...(paymentType === 'Multiple'
      ? paymentDetails.map((detail) => ({
          label: getReadablePaymentType(detail.type),
          value: formatAmount(detail.amount),
        }))
      : []),
    ...(paymentType !== 'Cash' && paymentType !== 'Multiple'
      ? [
          {
            label: getReadablePaymentType(paymentType),
            value: formatAmount(totalTTC),
          },
        ]
      : []),
    ...(remainingAmount < 0
      ? [{ label: 'Rendu', value: formatAmount(-remainingAmount) }]
      : []),
  ]

  details.forEach((detail, index) => {
    paymentContent += generatePaymentDetail(
      detail.label,
      detail.value,
      fontSize,
    )
  })

  paymentContent += '</div>'

  return paymentContent
}
