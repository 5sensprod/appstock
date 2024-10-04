import React, { useEffect } from 'react'
import useSearch from '../hooks/useSearch'
import ProductTable from './ProductTable'
import SelectCategory from '../category/SelectCategory'
import ProductSearch from './ProductSearch'
import { useProductContext } from '../../contexts/ProductContext'
import { useCategoryContext } from '../../contexts/CategoryContext'
import { Box, Typography } from '@mui/material'

const ProductPOS = () => {
  const {
    searchTerm,
    selectedCategoryId,
    setSelectedCategoryId,
    setSearchTerm,
    products,
    selectedProducts,
    handleProductSelect,
  } = useProductContext()

  const { categories } = useCategoryContext()

  const filteredProducts = useSearch(
    products,
    searchTerm,
    selectedCategoryId,
    categories,
  )

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchTerm('')
    }
  }, [searchTerm])

  return (
    <>
      <Box mb={2}>
        <ProductSearch />
      </Box>
      <Box mb={2}>
        <SelectCategory
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={(e) => setSelectedCategoryId(e.target.value)}
        />
      </Box>

      {filteredProducts.length > 0 ? (
        <ProductTable
          products={filteredProducts}
          onProductSelect={handleProductSelect}
          selectedProducts={selectedProducts}
        />
      ) : (
        <Typography variant="h6">Aucun produit trouvé</Typography>
      )}
    </>
  )
}

export default ProductPOS
