import React from 'react'
import { Typography, Box } from '@mui/material'
import DOMPurify from 'dompurify'

const ProductFicheTechnique = ({ productInfo, showTitle = true }) => {
  const cleanDescriptionCourte = DOMPurify.sanitize(
    productInfo.descriptionCourte || 'Aucune information',
  )

  return (
    <Box marginTop={2}>
      {showTitle && <Typography variant="h5">Fiche technique</Typography>}
      <Box
        dangerouslySetInnerHTML={{ __html: cleanDescriptionCourte }}
        sx={{ wordWrap: 'break-word' }}
      />
    </Box>
  )
}

export default ProductFicheTechnique
