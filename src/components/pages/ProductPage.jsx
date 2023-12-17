import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Grid from '@mui/material/Grid'

import ProductGrid from '../product/ProductGrid'
import CategoryTreeFilter from '../category/CategoryTreeFilter'
import { useProductContext } from '../../contexts/ProductContext'

const ProductPage = () => {
  const { productIds, categoryId } = useParams()

  const [filteredProducts, setFilteredProducts] = useState([])

  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId)

  const getProductIdsByCategory = (categoryId) => {
    return productCountByCategory[categoryId]?.productIds || []
  }
  const { products, categories, productCountByCategory, isLoading } =
    useProductContext()

  useEffect(() => {
    if (productIds) {
      const ids = productIds.split(',')
      setFilteredProducts(
        products.filter((product) => ids.includes(product._id)),
      )
    } else if (categoryId) {
      setSelectedCategoryId(categoryId)
      setFilteredProducts(
        products.filter((product) => product.categorie === categoryId),
      )
    } else {
      setSelectedCategoryId(null)
      setFilteredProducts(products)
    }
  }, [productIds, categoryId, products])

  const handleCategoryFilter = (selectedCategoryId) => {
    setSelectedCategoryId(selectedCategoryId)
    const filtered = selectedCategoryId
      ? products.filter((product) => product.categorie === selectedCategoryId)
      : products
    setFilteredProducts(filtered)
  }

  if (isLoading) {
    return <div>Chargement en cours...</div>
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <CategoryTreeFilter
          categories={categories}
          onCategorySelect={handleCategoryFilter}
          selectedCategoryId={selectedCategoryId}
          getProductIdsByCategory={getProductIdsByCategory}
          productCountByCategory={productCountByCategory}
        />
      </Grid>
      <Grid item xs={12} md={8}>
        <ProductGrid products={filteredProducts} categories={categories} />
      </Grid>
    </Grid>
  )
}

export default ProductPage
