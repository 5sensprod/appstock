import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import { useProductContext } from '../../contexts/ProductContext'
import ProductGrid from '../product/ProductGrid' // Remplacez ProductDetailsGrid par ProductGrid
import CategoryTreeFilter from '../category/CategoryTreeFilter'

const ProductPage = () => {
  const { products, categories } = useProductContext()
  const [filteredProducts, setFilteredProducts] = useState([])

  useEffect(() => {
    setFilteredProducts(products)
  }, [products])
  const handleCategoryFilter = (selectedCategoryId) => {
    const filtered = selectedCategoryId
      ? products.filter((product) => product.categorie === selectedCategoryId)
      : products
    setFilteredProducts(filtered)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        {' '}
        {/* Filtre de catégorie à gauche */}
        <CategoryTreeFilter
          categories={categories}
          onCategorySelect={handleCategoryFilter}
        />
      </Grid>
      <Grid item xs={12} md={9}>
        {' '}
        {/* Grille des produits à droite */}
        <ProductGrid products={filteredProducts} />
      </Grid>
    </Grid>
  )
}

export default ProductPage
