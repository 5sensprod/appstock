// Dans src/components/pages/SimplifiedProductPage.jsx

import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import { useUI } from '../../contexts/UIContext'
import SimplifiedProductGrid from '../product/SimplifiedProductGrid'
import SimplifiedCategoryTreeFilter from '../CATEGORIES/SimplifiedCategoryTreeFilter'
import { useCategoryContext } from '../../contexts/CategoryContext'
import { useProductContext } from '../../contexts/ProductContext'

const SimplifiedProductPage = () => {
  const { updatePageTitle } = useUI()
  const { categories } = useCategoryContext()
  const { products } = useProductContext()
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [filteredProducts, setFilteredProducts] = useState(products) // Initialise avec tous les produits

  useEffect(() => {
    if (selectedCategoryId) {
      const filtered = products.filter(
        (product) => product.categorie === selectedCategoryId,
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products) // Afficher tous les produits si aucune catégorie n'est sélectionnée
    }

    const category = categories.find((cat) => cat._id === selectedCategoryId)
    updatePageTitle(category ? category.name : 'Produits')
  }, [selectedCategoryId, products, categories, updatePageTitle])

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <SimplifiedCategoryTreeFilter
          onCategorySelect={handleCategorySelect}
          selectedCategoryId={selectedCategoryId}
        />
      </Grid>
      <Grid item xs={12} md={9}>
        <SimplifiedProductGrid products={filteredProducts} />
      </Grid>
    </Grid>
  )
}

export default SimplifiedProductPage
