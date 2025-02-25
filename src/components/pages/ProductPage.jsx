import React, { useContext } from 'react'
import Grid from '@mui/material/Grid'
import ProductManager from '../products/ProductManager'
import CategoryFilter from '../CATEGORIES/CategoryFilter'
import { CategoryTreeSelectContext } from '../../contexts/CategoryTreeSelectContext'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'
import { Box, Typography, Divider } from '@mui/material'
import MarginCorrectionButton from '../../utils/MarginCorrectionButton'

const ProductPage = () => {
  const { selectedCategory } = useContext(CategoryTreeSelectContext)
  const { searchTerm } = useProductContextSimplified()

  return (
    <Grid container direction="column" spacing={1} mt={2}>
      <Box ml={1} mb={1} sx={{ width: 'fit-content' }}>
        <Box maxWidth={'450px'}>
          <CategoryFilter />
        </Box>

        <Box display="flex" flexDirection="column" mb={2}>
          <Typography variant="subtitle1" gutterBottom>
            Outils de gestion
          </Typography>
          <MarginCorrectionButton />
          <Divider sx={{ my: 1 }} />
        </Box>

        <Box>
          <ProductManager
            selectedCategoryId={selectedCategory.categoryId}
            selectedCategory={selectedCategory}
            searchTerm={searchTerm}
          />
        </Box>
      </Box>
    </Grid>
  )
}

export default ProductPage
