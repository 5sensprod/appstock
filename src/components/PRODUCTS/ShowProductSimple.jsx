import React from 'react'
import { Typography, Box } from '@mui/material'

const ShowProductSimple = ({ productInfo }) => {
  return (
    <Box>
      <Box marginBottom={1}>
        <Typography variant="h5">Fiche technique</Typography>
      </Box>
      <Typography variant="body1">{productInfo.descriptionCourte}</Typography>
      <Box marginTop={3}>
        <Box marginBottom={1}>
          <Typography variant="h5">Description</Typography>
        </Box>
        <Typography variant="body2">{productInfo.description}</Typography>
      </Box>
    </Box>
  )
}

export default ShowProductSimple
