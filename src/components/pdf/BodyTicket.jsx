import React from 'react'
import { Box, Typography, Grid } from '@mui/material'

const BodyTicket = ({ data, fontSize = '9px' }) => {
  const commonStyle = { fontSize, fontWeight: 'bold' }

  // Initialisation vide, sera défini en fonction des données
  let columnTitle = ''

  // Modification ici pour utiliser remiseMajorationValue pour déterminer la présence de remise/majoration
  const hasRemiseOrMajoration = data.items.some(
    (item) => item.remiseMajorationValue !== 0,
  )

  // Si remise ou majoration est présente, déterminer si c'est une remise ou majoration pour le titre
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
        {/* Affichage conditionnel de la colonne pour Remise/Majoration avec titre ajusté selon la nouvelle logique */}
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
                {item.quantite}
              </Typography>
            </Grid>
            <Grid item xs={hasRemiseOrMajoration ? 3 : 4}>
              <Typography sx={{ ...commonStyle, fontWeight: 'normal' }}>
                {item.reference}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography sx={{ ...commonStyle, fontWeight: 'normal' }}>
                {item.prixOriginal
                  ? item.prixOriginal.toFixed(2).replace('.', ',')
                  : item.puHT.toFixed(2).replace('.', ',')}
              </Typography>
            </Grid>
            {/* Affichage conditionnel de la valeur de Remise/Majoration ajusté selon la nouvelle logique */}
            {hasRemiseOrMajoration && (
              <Grid item xs={2}>
                <Typography sx={{ ...commonStyle, fontWeight: 'normal' }}>
                  {item.remiseMajorationValue !== 0
                    ? `${item.remiseMajorationValue.toString().replace('.', ',')}`
                    : '0'}
                </Typography>
              </Grid>
            )}
            <Grid item xs={2}>
              <Typography sx={{ ...commonStyle, fontWeight: 'normal' }}>
                {(item.quantite * item.puTTC).toFixed(2).replace('.', ',')}
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
