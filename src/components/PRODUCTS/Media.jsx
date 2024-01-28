import React from 'react'
import { Box, Card, CardMedia, Grid, Typography } from '@mui/material'

const Media = ({ photos, baseUrl }) => {
  return (
    <>
      <Typography variant="h5">Photos</Typography>
      <Box sx={{ p: 3 }}>
        {photos && photos.length > 0 ? (
          <Grid container spacing={1}>
            {photos.map((photo, index) => {
              const photoUrl = `${baseUrl}/${photo}`
              return (
                <Grid item xs={6} sm={4} md={2} lg={2} key={index}>
                  <Card sx={{ '&:hover': { opacity: 0.8 } }}>
                    <CardMedia
                      component="img"
                      image={photoUrl}
                      alt={`Photo ${index + 1}`}
                      sx={{ width: '100%', height: 'auto' }}
                    />
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        ) : (
          <Typography>Aucune photo disponible</Typography>
        )}
      </Box>
    </>
  )
}

export default Media
