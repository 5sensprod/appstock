import React from 'react'
import { Typography, Box } from '@mui/material'
import DOMPurify from 'dompurify'

const ShowProductSimple = ({ productInfo }) => {
  const cleanDescription = DOMPurify.sanitize(
    productInfo.description || 'Aucune information',
  )
  const cleanDescriptionCourte = DOMPurify.sanitize(
    productInfo.descriptionCourte || 'Aucune information',
  )

  return (
    <Box>
      {/* Fiche technique */}
      <Box marginBottom={1}>
        <Typography variant="h5">Fiche technique</Typography>
      </Box>
      <Box
        dangerouslySetInnerHTML={{ __html: cleanDescriptionCourte }}
        sx={{ wordWrap: 'break-word' }}
      />

      {/* Description */}
      <Box marginTop={3}>
        <Box marginBottom={1}>
          <Typography variant="h5">Description</Typography>
        </Box>
        <Box
          dangerouslySetInnerHTML={{ __html: cleanDescription }}
          sx={{ wordWrap: 'break-word' }}
        />
      </Box>
    </Box>
  )
}

export default ShowProductSimple
