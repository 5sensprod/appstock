// src/components/PRODUCTS/ProductModal.jsx
import React, { useState } from 'react'
import { CardMedia } from '@mui/material'
import GenericModal from '../ui/GenericModal'
import ProductDescription from './ProductDescription'
import ProductFicheTechnique from './ProductFicheTechnique'

const ProductModal = ({ product, baseUrl, open, onClose }) => {
  if (!product) return null

  const [tabValue, setTabValue] = useState(0)
  const imageUrl = product.featuredImage
    ? `${baseUrl}/catalogue/${product._id}/${product.featuredImage}`
    : `${baseUrl}/catalogue/default/default.png`

  const content = (
    <>
      <CardMedia
        component="img"
        height="140"
        image={imageUrl}
        alt={product.reference || 'Image du produit'}
      />
      {tabValue === 0 ? (
        <ProductDescription productInfo={product} />
      ) : (
        <ProductFicheTechnique productInfo={product} />
      )}
    </>
  )
  return (
    <GenericModal
      open={open}
      onClose={onClose}
      title={product.reference || 'Titre non disponible'}
      content={content}
      tabValue={tabValue}
      setTabValue={setTabValue}
      // ... autres props si nécessaire
    ></GenericModal>
  )
}

export default ProductModal
