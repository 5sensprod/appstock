import React from 'react'
import { Grid, Card, CardMedia, Checkbox, Box } from '@mui/material'

const PhotoGrid = ({
  photos,
  onPhotoClick,
  onToggleSelect,
  selectedPhotos,
}) => {
  return (
    <Grid container spacing={1}>
      {photos.map((photo, index) => {
        const isSelected = selectedPhotos.includes(photo)
        return (
          <Grid item xs={6} sm={4} md={2} lg={2} key={index}>
            <Card
              sx={{
                position: 'relative',
                transition:
                  'box-shadow 0.2s ease-in-out, opacity 0.3s ease-in-out', // Ajoutez une transition pour un effet lisse
                boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)', // Style par défaut
                opacity: 1, // Opacité par défaut
                '&:hover': {
                  cursor: 'pointer',
                  boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)',
                  opacity: 0.6, // Réduire l'opacité lors du survol
                },
              }}
            >
              <CardMedia
                component="img"
                image={photo}
                alt={`Photo ${index + 1}`}
                sx={{ width: '100%', height: 'auto' }}
                onClick={() => onPhotoClick(photo)}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 5,
                  right: 5,
                  backgroundColor: 'white',
                  borderRadius: '10%',
                }}
              >
                <Checkbox
                  checked={isSelected}
                  onChange={() => onToggleSelect(photo)}
                  size="small"
                  sx={{
                    padding: '0 1px 1px 1px ',
                    '& .MuiSvgIcon-root': { fontSize: 20 },
                  }}
                />
              </Box>
            </Card>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default PhotoGrid
