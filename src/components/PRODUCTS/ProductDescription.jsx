import React from 'react'
import { Typography, Box } from '@mui/material'
import DOMPurify from 'dompurify'

const ProductDescription = ({ productInfo, showTitle = true }) => {
  const cleanDescription = DOMPurify.sanitize(
    productInfo.description || 'Aucune information',
  )

  return (
    <Box marginTop={2}>
      {showTitle && <Typography variant="h5">Description</Typography>}
      <Box
        dangerouslySetInnerHTML={{ __html: cleanDescription }}
        sx={{ wordWrap: 'break-word' }}
      />
    </Box>
  )
}

export default ProductDescription
