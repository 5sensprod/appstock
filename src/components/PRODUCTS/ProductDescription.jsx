import React from 'react'
import { Typography, Box } from '@mui/material'
import DOMPurify from 'dompurify'
import { isEmptyContent } from '../../utils/textHtmlUtils'

const ProductDescription = ({
  productInfo,
  showTitle = true,
  showPrice = false,
}) => {
  const descriptionHtml = DOMPurify.sanitize(productInfo.description || '')
  const isDescriptionEmpty = isEmptyContent(descriptionHtml)

  return (
    <Box marginTop={2}>
      {showTitle && (
        <Typography variant="h5" mb={2}>
          Description
        </Typography>
      )}
      {isDescriptionEmpty ? (
        <Typography variant="body1">Aucune information</Typography>
      ) : (
        <Box
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          sx={{ wordWrap: 'break-word' }}
        />
      )}
      {showPrice && productInfo.price && (
        <Typography variant="body1">Prix: {productInfo.price}</Typography>
      )}
    </Box>
  )
}

export default ProductDescription
