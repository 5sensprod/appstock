import React, { useState } from 'react'
import { Box, Card, CardMedia, Grid, Typography, Dialog } from '@mui/material'

const Media = ({ photos, baseUrl }) => {
  const [open, setOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  const handleOpen = (photoUrl) => {
    setSelectedPhoto(photoUrl)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

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
                  <Card
                    sx={{ '&:hover': { opacity: 0.8 } }}
                    onClick={() => handleOpen(photoUrl)}
                  >
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
      <Dialog open={open} onClose={handleClose} sx={{ mt: 4 }}>
        <img
          src={selectedPhoto}
          alt="Selected"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </Dialog>
    </>
  )
}

export default Media
