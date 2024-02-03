import React from 'react'
import { Grid, Card, CardMedia, Checkbox, Box } from '@mui/material'

const PhotoGrid = ({
  photos,
  onPhotoClick,
  onToggleSelect,
  selectedPhotos,
  featuredImageName,
  productId,
}) => {
  return (
    <Grid container spacing={2}>
      {photos.map((photo, index) => {
        const isSelected = selectedPhotos.includes(photo)
        const isFeatured = photo.includes(featuredImageName)
        return (
          <Grid item key={index}>
            <Card
              sx={{
                position: 'relative',
                transition:
                  'box-shadow 0.2s ease-in-out, opacity 0.3s ease-in-out',
                boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
                opacity: 1,
                '&:hover': {
                  cursor: 'pointer',
                  boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)',
                  opacity: 0.6,
                },
              }}
            >
              <CardMedia
                component="img"
                image={photo}
                alt={`Photo ${index + 1}`}
                // sx={{ width: '100%', height: 'auto' }}
                sx={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  padding: '5px',
                  borderRadius: '8px',
                }}
                onClick={() => onPhotoClick(photo)}
              />
              {!isFeatured && (
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
              )}
            </Card>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default PhotoGrid
