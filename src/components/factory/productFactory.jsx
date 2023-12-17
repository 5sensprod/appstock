import React from 'react'
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material'
import { getProductImageUrl } from '../../utils/imageUtils'

function productFactory(
  _id,
  reference,
  descriptionCourte,
  prixVente,
  photos,
  categorie,
  baseUrl,
) {
  function createProductElement() {
    const imageUrl = getProductImageUrl(photos, baseUrl)
    return (
      <Card
        key={_id}
        style={{
          width: '200px',
          margin: '10px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardMedia
          component="img"
          height="140"
          image={imageUrl}
          alt={`Image de ${reference}`}
        />
        <Box flexGrow={1} overflow="hidden">
          <CardContent>
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {reference}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3,
                overflow: 'hidden',
              }}
            >
              {descriptionCourte}
            </Typography>
          </CardContent>
        </Box>
        <Box p={2}>
          <Typography
            variant="body1"
            color="text.primary"
            style={{ textAlign: 'right' }}
          >
            {`Prix: ${prixVente} €`}
          </Typography>
        </Box>
      </Card>
    )
  }

  function render() {
    return createProductElement()
  }

  return {
    _id,
    reference,
    descriptionCourte,
    prixVente,
    photos,
    categorie,
    render,
  }
}

export { productFactory }
