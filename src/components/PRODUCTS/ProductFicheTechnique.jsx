import React from 'react'
import { Typography, Box } from '@mui/material'
import DOMPurify from 'dompurify'
import { isEmptyContent } from '../../utils/textHtmlUtils'

const ProductFicheTechnique = ({ productInfo, showTitle = true }) => {
  const descriptionCourteHtml = DOMPurify.sanitize(
    productInfo.descriptionCourte || '',
  )
  const isDescriptionCourteEmpty = isEmptyContent(descriptionCourteHtml)

  return (
    <Box marginTop={2}>
      {showTitle && (
        <Typography variant="h5" mb={2}>
          Fiche technique
        </Typography>
      )}
      {isDescriptionCourteEmpty ? (
        <Typography variant="body1">Aucune information</Typography>
      ) : (
        <Box
          dangerouslySetInnerHTML={{ __html: descriptionCourteHtml }}
          sx={{ wordWrap: 'break-word' }}
        />
      )}
    </Box>
  )
}

export default ProductFicheTechnique
