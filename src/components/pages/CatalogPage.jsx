import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductContext } from '../../contexts/ProductContext'
import ProductSearch from '../productPOS/ProductSearch'
import SelectCategory from '../category/SelectCategory'
import useSearch from '../hooks/useSearch'
import ProductCatalog from '../productPOS/ProductCatalog'
import { Box } from '@mui/material'
import { useCategoryContext } from '../../contexts/CategoryContext'
import { useGridPreferences } from '../../contexts/GridPreferenceContext'

const CatalogPage = () => {
  const { products, searchTerm, selectedCategoryId, handleCategoryChange } =
    useProductContext()

  const { resetCurrentPage } = useGridPreferences()

  const { categories } = useCategoryContext()

  const filteredProducts = useSearch(
    products,
    searchTerm,
    selectedCategoryId,
    categories,
  )
  const navigate = useNavigate()

  const redirectToEdit = (productId) => {
    navigate(`/edit-product/${productId}`)
  }

  const handleCategoryChangeWithReset = (event) => {
    handleCategoryChange(event, resetCurrentPage)
  }

  return (
    <div style={{ width: '100%' }}>
      <Box display="flex" alignItems="center" gap={2} my={2}>
        <Box width={'30%'}>
          <SelectCategory
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={handleCategoryChangeWithReset}
            onFocus={resetCurrentPage}
          />
        </Box>
        <Box width={'70%'}>
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
