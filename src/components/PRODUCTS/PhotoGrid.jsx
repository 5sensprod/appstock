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
            <Card sx={{ position: 'relative' }}>
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
