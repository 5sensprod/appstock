import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductContext } from '../../contexts/ProductContext'
import ProductSearch from '../productPOS/ProductSearch'
import useSearch from '../hooks/useSearch'
import ProductCatalog from '../productPOS/ProductCatalog'
import { Box } from '@mui/material'
import { useCategoryContext } from '../../contexts/CategoryContext'

import CategoryFilter from '../CATEGORIES/CategoryFilter'
import { CategoryTreeSelectContext } from '../../contexts/CategoryTreeSelectContext'

const CatalogPage = () => {
  const { products, searchTerm } = useProductContext()

  const { categories } = useCategoryContext()

  const { selectedCategory } = useContext(CategoryTreeSelectContext)

  const filteredProducts = useSearch(
    products,
    searchTerm,
    null,
    categories,
  ).filter((product) => {
    if (!selectedCategory?.categoryId) return true
    return selectedCategory.selectedCategoryIds.includes(product.categorie)
  })

  const navigate = useNavigate()

  const redirectToEdit = (productId) => {
    navigate(`/edit-product/${productId}`)
  }

  return (
    <div style={{ width: '100%' }}>
      <Box display="flex" alignItems="center" gap={2} my={2}>
        <Box width={'30%'}>
          <CategoryFilter />
        </Box>
        <Box width={'60%'}>
          <ProductSearch />
        </Box>
      </Box>

      <ProductCatalog
        products={filteredProducts}
        redirectToEdit={redirectToEdit}
      />
    </div>
  )
}

export default CatalogPage
