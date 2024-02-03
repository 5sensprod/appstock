import React from 'react'
import { Typography, Box } from '@mui/material'
import ProductDescription from './ProductDescription'
import ProductFicheTechnique from './ProductFicheTechnique'

const ShowProductSimple = ({ productInfo }) => {
  return (
    <Box mt={5}>
      <ProductFicheTechnique productInfo={productInfo} />
      <ProductDescription productInfo={productInfo} />
    </Box>
  )
}

export default ShowProductSimple
