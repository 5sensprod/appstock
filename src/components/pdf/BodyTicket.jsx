import React from 'react'
import { Box, Typography, Grid } from '@mui/material'

const BodyTicket = ({ data }) => {
  return (
    <Box textAlign={'left'}>
      <Grid container spacing={1} alignItems="center">
        {/* En-têtes avec style spécifique */}
        <Grid item xs={2}>
          <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>
            Qté
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>
            Article
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>
            P.U. EUR
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>
            TTC EUR
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>
            Tx
          </Typography>
        </Grid>

        {/* Lignes d'articles avec style spécifique pour le texte */}
        {data.items.map((item) => (
          <React.Fragment key={item.reference}>
            <Grid item xs={2}>
              <Typography sx={{ fontSize: '10px' }}>{item.quantite}</Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography sx={{ fontSize: '10px' }}>
                {item.reference}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography sx={{ fontSize: '10px' }}>
                {item.puTTC.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography sx={{ fontSize: '10px' }}>
                {(item.quantite * item.puTTC).toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography sx={{ fontSize: '10px' }}>{item.tauxTVA}</Typography>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Box>
  )
}

export default BodyTicket
