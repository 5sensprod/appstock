import React, { useContext } from 'react'
import Grid from '@mui/material/Grid'
import ProductManager from '../products/ProductManager'
import CategoryFilter from '../CATEGORIES/CategoryFilter'
import { CategoryTreeSelectContext } from '../../contexts/CategoryTreeSelectContext'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'
import { Box } from '@mui/material'

const ProductPage = () => {
  const { selectedCategory } = useContext(CategoryTreeSelectContext)
  const { searchTerm } = useProductContextSimplified()

  return (
    <Grid container direction="column" spacing={1} mt={2}>
      <Box ml={1} mb={1} sx={{ width: 'fit-content' }}>
        <Box maxWidth={'450px'}>
          <CategoryFilter />
        </Box>
        <Box>
          <ProductManager
            selectedCategoryId={selectedCategory.categoryId}
            searchTerm={searchTerm}
          />
        </Box>
      </Box>
    </Grid>
  )
}

export default ProductPage
