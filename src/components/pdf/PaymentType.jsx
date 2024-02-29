import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

const PaymentType = ({
  paymentType,
  cashDetails = {},
  paymentDetails = [],
  totalTTC,
  fontSize = '12px', // Ajout de fontSize comme prop avec une valeur par défaut
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

  const paymentTypeDisplay = () => {
    switch (paymentType) {
      case 'Cash':
        return (
          <Grid container>
            <Grid item xs={6} textAlign={'right'}>
              <Typography variant="body2" sx={{ fontSize, fontWeight: 'bold' }}>
                {`${getReadablePaymentType(paymentType)} :`}
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign={'right'}>
              <Typography variant="body2" sx={{ fontSize, fontWeight: 'bold' }}>
                {`${formatAmount(cashDetails.givenAmount)}`}
              </Typography>
            </Grid>
            {cashDetails.changeAmount !== undefined && (
              <>
                <Grid item xs={6} textAlign={'right'}>
                  <Typography
                    variant="body2"
                    sx={{ fontSize, fontWeight: 'bold' }}
                  >
                    Rendu :
                  </Typography>
                </Grid>
                <Grid item xs={6} textAlign={'right'}>
                  <Typography
                    variant="body2"
                    sx={{ fontSize, fontWeight: 'bold' }}
                  >
                    {formatAmount(cashDetails.changeAmount)}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        )
      case 'Multiple':
        return (
          <Grid container>
            {paymentDetails && paymentDetails.length > 0 ? (
              paymentDetails.map((detail, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={6} textAlign={'right'}>
                    <Typography
                      variant="body2"
                      sx={{ fontSize, fontWeight: 'bold' }}
                    >
                      {getReadablePaymentType(detail.type)} :
                    </Typography>
                  </Grid>
                  <Grid item xs={6} textAlign={'right'}>
                    <Typography
                      variant="body2"
                      sx={{ fontSize, fontWeight: 'bold' }}
                    >
                      {formatAmount(detail.amount)}
                    </Typography>
                  </Grid>
                </React.Fragment>
              ))
            ) : (
              <Typography variant="body2" sx={{ fontSize, fontWeight: 'bold' }}>
                Paiements multiples
              </Typography>
            )}
          </Grid>
        )
      default:
        return (
          <Grid container>
            <Grid item xs={6} textAlign={'left'}>
              <Typography variant="body2" sx={{ fontSize, fontWeight: 'bold' }}>
                {`${getReadablePaymentType(paymentType)} :`}
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign={'right'}>
              <Typography variant="body2" sx={{ fontSize, fontWeight: 'bold' }}>
                {formatAmount(totalTTC)}
              </Typography>
            </Grid>
          </Grid>
        )
    }
  }

  return <Box sx={{ mt: 2 }}>{paymentTypeDisplay()}</Box>
}

export default PaymentType
