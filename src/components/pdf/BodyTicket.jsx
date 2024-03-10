import React from 'react'
import { Box, Typography, Grid } from '@mui/material'

// Fonction d'aide pour formater les nombres en remplaçant le point par une virgule
const formatNumber = (input) => {
  const number = parseFloat(input)
  if (isNaN(number)) {
    return 'Invalid input' // Retourne un message ou gère l'erreur comme souhaité
  }
  return number.toFixed(2).replace('.', ',')
}

const BodyTicket = ({ data, fontSize = '9px' }) => {
  const commonStyle = { fontSize, fontWeight: 'bold' }

  // Détermination de la présence de remise ou majoration
  const hasRemiseOrMajoration = data.items.some(
    (item) => item.remiseMajorationValue !== 0,
  )

  let columnTitle = ''
  if (hasRemiseOrMajoration) {
    const hasRemise = data.items.some(
      (item) =>
        item.remiseMajorationLabel === 'Remise' &&
        item.remiseMajorationValue !== 0,
    )
    const hasMajoration = data.items.some(
      (item) =>
        item.remiseMajorationLabel === 'Majoration' &&
        item.remiseMajorationValue !== 0,
    )
    columnTitle = hasRemise ? 'Rem. %' : hasMajoration ? 'Maj. %' : ''
  }

  return (
    <Box textAlign={'left'}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={2}>
          <Typography sx={commonStyle}>Qté</Typography>
        </Grid>
        <Grid item xs={hasRemiseOrMajoration ? 3 : 4}>
          <Typography sx={commonStyle}>Article</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography sx={commonStyle}>P.U. EUR</Typography>
        </Grid>
        {hasRemiseOrMajoration && (
          <Grid item xs={2}>
            <Typography sx={commonStyle}>{columnTitle}</Typography>
          </Grid>
        )}
        <Grid item xs={2}>
          <Typography sx={commonStyle}>TTC EUR</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography sx={commonStyle}>Tx</Typography>
        </Grid>

        {data.items.map((item) => (
          <React.Fragment key={item.reference}>
            <Grid item xs={2}>
              <Typography sx={{ ...commonStyle, fontWeight: 'normal' }}>
                {item.quantite || item.quantity}
              </Typography>
            </Grid>
            <Grid item xs={hasRemiseOrMajoration ? 3 : 4}>
              <Typography sx={{ ...commonStyle, fontWeight: 'normal' }}>
                {item.reference}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography sx={{ ...commonStyle, fontWeight: 'normal' }}>
                {item.prixOriginal !== undefined
                  ? formatNumber(item.prixOriginal)
                  : formatNumber(item.puHT)}
              </Typography>
            </Grid>
            {hasRemiseOrMajoration && (
              <Grid item xs={2}>
                <Typography sx={{ ...commonStyle, fontWeight: 'normal' }}>
                  {item.remiseMajorationValue !== 0
                    ? `${formatNumber(item.remiseMajorationValue)}`
                    : '0'}
                </Typography>
              </Grid>
            )}
            <Grid item xs={2}>
              <Typography sx={{ ...commonStyle, fontWeight: 'normal' }}>
                {formatNumber(
                  (item.quantite || item.quantity) *
                    (item.puTTC || item.prixTTC),
                )}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography sx={{ ...commonStyle, fontWeight: 'normal' }}>
                {item.tauxTVA.toString().replace('.', ',')}
              </Typography>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Box>
  )
}

export default BodyTicket
