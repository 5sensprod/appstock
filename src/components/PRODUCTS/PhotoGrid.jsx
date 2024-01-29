import React from 'react'
import { Grid, Card, CardMedia } from '@mui/material'

const PhotoGrid = ({ photos, onPhotoClick }) => {
  return (
    <Grid container spacing={1}>
      {photos.map((photo, index) => {
        return (
          <Grid item xs={6} sm={4} md={2} lg={2} key={index}>
            <Card
              sx={{ '&:hover': { opacity: 0.8 } }}
              onClick={() => onPhotoClick(photo)}
            >
              <CardMedia
                component="img"
                image={photo}
                alt={`Photo ${index + 1}`}
                sx={{ width: '100%', height: 'auto' }}
              />
            </Card>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default PhotoGrid
