import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductContext } from '../../contexts/ProductContext'
import ProductSearch from '../product/ProductSearch'
import SelectCategory from '../category/SelectCategory'
import useSearch from '../hooks/useSearch'
import ProductGallery from '../product/ProductGallery'
import { Box } from '@mui/material'

const CatalogPageSimple = () => {
  const {
    categories,
    products,
    searchTerm,
    selectedCategoryId,
    handleCategoryChange,
  } = useProductContext()

  const filteredProducts = useSearch(products, searchTerm, selectedCategoryId)
  const navigate = useNavigate()

  const redirectToEdit = (productId) => {
    navigate(`/edit-product/${productId}`)
  }

  return (
    <div style={{ width: '100%' }}>
      <Box display="flex" alignItems="center" gap={2} my={2}>
        <Box width={'30%'}>
          <SelectCategory
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={handleCategoryChange}
          />
        </Box>
        <Box width={'70%'}>
          <ProductSearch />
        </Box>
      </Box>
      <ProductGallery
        products={filteredProducts}
        redirectToEdit={redirectToEdit}
      />
    </div>
  )
}

export default CatalogPageSimple