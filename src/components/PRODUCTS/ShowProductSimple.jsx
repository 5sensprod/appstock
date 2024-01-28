import React from 'react'
import { Typography, Box } from '@mui/material'

const CustomTypography = ({ variant, condition, children }) => {
  return (
    <Typography
      variant={condition ? 'body1' : variant}
      color={condition ? 'textPrimary' : 'textSecondary'}
    >
      {children}
    </Typography>
  )
}

const ShowProductSimple = ({ productInfo }) => {
  return (
    <Box>
      <Box marginBottom={1}>
        <Typography variant="h5">Fiche technique</Typography>
      </Box>
      <CustomTypography
        variant="body2"
        condition={!!productInfo.descriptionCourte}
      >
        {productInfo.descriptionCourte || 'Aucune information'}
      </CustomTypography>
      <Box marginTop={3}>
        <Box marginBottom={1}>
          <Typography variant="h5">Description</Typography>
        </Box>
        <CustomTypography variant="body2" condition={!!productInfo.description}>
          {productInfo.description || 'Aucune information'}
        </CustomTypography>
      </Box>
    </Box>
  )
}

export default ShowProductSimple
