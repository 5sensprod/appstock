import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

const PaymentType = ({
  paymentType,
  cashDetails = {},
  paymentDetails = [],
  totalTTC,
  remainingAmount,
  fontSize = '12px',
}) => {
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

  const formatAmount = (amount) => {
    return parseFloat(amount).toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const PaymentDetail = ({ label, value }) => (
    <Grid container>
      <Grid item xs={6} textAlign={'right'}>
        <Typography variant="body2" sx={{ fontSize, fontWeight: 'normal' }}>
          {label} :
        </Typography>
      </Grid>
      <Grid item xs={6} textAlign={'right'}>
        <Typography variant="body2" sx={{ fontSize, fontWeight: 'normal' }}>
          {value}
        </Typography>
      </Grid>
    </Grid>
  )

  const paymentTypeDisplay = () => {
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

    return (
      <>
        <Grid container sx={{ marginBottom: 1 }}>
          <Grid item xs={6}>
            <Typography
              variant="body2"
              sx={{ fontSize, fontWeight: 'bold', textAlign: 'right' }}
            >
              Paiement EUR
            </Typography>
          </Grid>
        </Grid>
        {details.map((detail, index) => (
          <PaymentDetail
            key={index}
            label={detail.label}
            value={detail.value}
          />
        ))}
      </>
    )
  }

  return <Box sx={{ mt: 2 }}>{paymentTypeDisplay()}</Box>
}

export default PaymentType
