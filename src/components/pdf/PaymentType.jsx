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

  const paymentTypeDisplay = () => {
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
        {paymentType === 'Cash' && (
          <>
            <Grid container>
              <Grid item xs={6} textAlign={'right'}>
                <Typography
                  variant="body2"
                  sx={{ fontSize, fontWeight: 'normal' }}
                >
                  {getReadablePaymentType(paymentType)} :
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign={'right'}>
                <Typography
                  variant="body2"
                  sx={{ fontSize, fontWeight: 'normal' }}
                >
                  {`${formatAmount(cashDetails.givenAmount)}`}
                </Typography>
              </Grid>
              {cashDetails.changeAmount !== undefined && (
                <>
                  <Grid item xs={6} textAlign={'right'}>
                    <Typography
                      variant="body2"
                      sx={{ fontSize, fontWeight: 'normal' }}
                    >
                      Rendu :
                    </Typography>
                  </Grid>
                  <Grid item xs={6} textAlign={'right'}>
                    <Typography
                      variant="body2"
                      sx={{ fontSize, fontWeight: 'normal' }}
                    >
                      {formatAmount(cashDetails.changeAmount)}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </>
        )}
        {paymentType === 'Multiple' && (
          <Grid container>
            {paymentDetails && paymentDetails.length > 0 ? (
              paymentDetails.map((detail, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={6} textAlign={'right'}>
                    <Typography
                      variant="body2"
                      sx={{ fontSize, fontWeight: 'normal' }}
                    >
                      {`${getReadablePaymentType(detail.type)} :`}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} textAlign={'right'}>
                    <Typography
                      variant="body2"
                      sx={{ fontSize, fontWeight: 'normal' }}
                    >
                      {formatAmount(detail.amount)}
                    </Typography>
                  </Grid>
                </React.Fragment>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  sx={{ fontSize, fontWeight: 'normal', textAlign: 'center' }}
                >
                  Paiements multiples
                </Typography>
              </Grid>
            )}
            {/* Conditionnellement afficher le montant rendu si remainingAmount est négatif */}
            {remainingAmount < 0 && (
              <>
                <Grid item xs={6} textAlign={'right'}>
                  <Typography
                    variant="body2"
                    sx={{ fontSize, fontWeight: 'normal' }}
                  >
                    Rendu :
                  </Typography>
                </Grid>
                <Grid item xs={6} textAlign={'right'}>
                  <Typography
                    variant="body2"
                    sx={{ fontSize, fontWeight: 'normal' }}
                  >
                    {formatAmount(-remainingAmount)}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        )}
        {paymentType !== 'Cash' && paymentType !== 'Multiple' && (
          <Grid container>
            <Grid item xs={6} textAlign={'right'}>
              <Typography
                variant="body2"
                sx={{ fontSize, fontWeight: 'normal' }}
              >
                {`${getReadablePaymentType(paymentType)} :`}
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign={'right'}>
              <Typography
                variant="body2"
                sx={{ fontSize, fontWeight: 'normal' }}
              >
                {formatAmount(totalTTC)}
              </Typography>
            </Grid>
          </Grid>
        )}
      </>
    )
  }

  return <Box sx={{ mt: 2 }}>{paymentTypeDisplay()}</Box>
}

export default PaymentType
