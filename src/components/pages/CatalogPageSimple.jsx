import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductContext } from '../../contexts/ProductContext'
import ProductSearch from '../product/ProductSearch'
import SelectCategory from '../category/SelectCategory'
import useSearch from '../hooks/useSearch'
import ProductCatalog from '../product/ProductCatalog'
import ProductGallery from '../product/ProductGallery'
import { Box, IconButton } from '@mui/material'
import ViewListIcon from '@mui/icons-material/ViewList'
import ViewComfyIcon from '@mui/icons-material/ViewComfy'

const CatalogPageSimple = () => {
  const {
    categories,
    products,
    searchTerm,
    selectedCategoryId,
    handleCategoryChange,
  } = useProductContext()

  const [viewMode, setViewMode] = useState('gallery')
  const filteredProducts = useSearch(products, searchTerm, selectedCategoryId)
  const navigate = useNavigate()

  const redirectToEdit = (productId) => {
    navigate(`/edit-product/${productId}`)
  }

  return (
    <div style={{ width: '100%' }}>
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        my={2}
        justifyContent={'space-between'}
      >
        <Box display="flex" alignItems="center" gap={2} my={2} flex={1}>
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
        <Box display="flex" gap={2}>
          {viewMode === 'gallery' && (
            <IconButton
              size="small"
              color="primary"
              onClick={() => setViewMode('table')}
            >
              <ViewListIcon />
            </IconButton>
          )}

          {viewMode === 'table' && (
            <IconButton
              size="small"
              color="primary"
              onClick={() => setViewMode('gallery')}
            >
              <ViewComfyIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      {viewMode === 'table' ? (
        <ProductCatalog
          products={filteredProducts}
          redirectToEdit={redirectToEdit}
          categories={categories}
        />
      ) : (
        <ProductGallery
          products={filteredProducts}
          redirectToEdit={redirectToEdit}
        />
      )}
    </div>
  )
}

export default CatalogPageSimple
