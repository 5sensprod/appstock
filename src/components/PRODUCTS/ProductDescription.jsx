import React from 'react'
import { Typography, Box } from '@mui/material'
import DOMPurify from 'dompurify'

const ProductDescription = ({ productInfo }) => {
  const cleanDescription = DOMPurify.sanitize(
    productInfo.description || 'Aucune information',
  )

  return (
    <Box marginTop={3}>
      <Box marginBottom={1}>
        <Typography variant="h5">Description</Typography>
      </Box>
      <Box
        dangerouslySetInnerHTML={{ __html: cleanDescription }}
        sx={{ wordWrap: 'break-word' }}
      />
    </Box>
  )
}

export default ProductDescription
