import React from 'react'
import { Box, Typography, Grid } from '@mui/material'

const BodyTicket = ({ data, fontSize = '10px' }) => {
  const commonStyle = { fontSize, fontWeight: 'bold' }

  return (
    <Box textAlign={'left'}>
      <Grid container spacing={1} alignItems="center">
        {/* En-têtes avec style spécifique */}
        <Grid item xs={2}>
          <Typography sx={commonStyle}>Qté</Typography>
        </Grid>
        <Grid item xs={5}>
          <Typography sx={commonStyle}>Article</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography sx={commonStyle}>P.U. EUR</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography sx={commonStyle}>TTC EUR</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography sx={commonStyle}>Tx</Typography>
        </Grid>

        {/* Lignes d'articles avec style spécifique pour le texte */}
        {data.items.map((item) => (
          <React.Fragment key={item.reference}>
            <Grid item xs={2}>
              <Typography sx={{ ...commonStyle, fontWeight: 'normal' }}>
                {item.quantite}
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography sx={{ ...commonStyle, fontWeight: 'normal' }}>
                {item.reference}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography sx={{ ...commonStyle, fontWeight: 'normal' }}>
                {item.puTTC.toFixed(2).replace('.', ',')}
              </Typography>
            </Grid>
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
