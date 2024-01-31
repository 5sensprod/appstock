import React from 'react'
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material'
import { stripHtml, isEmptyContent } from '../../utils/textHtmlUtils'
import { cardStyles } from './cardStyles'
import { formatPrice } from '../../utils/priceUtils'

function productFactory(props) {
  const {
    _id,
    reference,
    description,
    prixVente,
    featuredImage,
    baseUrl,
    redirectToEdit,
    categoryName,
  } = props

  const textdescription = !isEmptyContent(description)
    ? stripHtml(description)
    : 'Aucune information'

  const imageUrl = featuredImage
    ? `${baseUrl}/catalogue/${_id}/${featuredImage}`
    : `${baseUrl}/catalogue/default/default.png`

  const isDefaultImage = !featuredImage

  const onCardClick = () => {
    redirectToEdit(_id)
  }

  const render = () => (
    <Card key={_id} sx={cardStyles} onClick={onCardClick}>
      <CardMedia
        component="img"
        height="140"
        image={imageUrl}
        alt={`Image de ${reference}`}
        style={{ opacity: isDefaultImage ? 0.1 : 1 }}
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
              WebkitLineClamp: 4,
              overflow: 'hidden',
            }}
          >
            {textdescription}
          </Typography>
        </CardContent>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={2}
      >
        <Typography variant="body1" color="text.primary">
          {formatPrice(prixVente)}
        </Typography>
        <Typography variant="body1" color="text.primary">
          {categoryName}
        </Typography>
      </Box>
    </Card>
  )

  return { ...props, render }
}

export { productFactory }
