// src/components/PRODUCTS/ProductModal.jsx
import React, { useState } from 'react'
import { CardMedia, Typography } from '@mui/material'
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
      {/* <CardMedia
        component="img"
        style={{ height: '120px', width: 'auto', borderRadius: '10px' }}
        image={imageUrl}
        alt={product.reference || 'Image du produit'}
      /> */}
      <Typography variant="h6" fontWeight="bold">
        {product.reference}
      </Typography>
      {tabValue === 0 ? (
        <ProductDescription productInfo={product} showTitle={false} />
      ) : (
        <ProductFicheTechnique productInfo={product} showTitle={false} />
      )}
    </>
  )
  return (
    <GenericModal
      open={open}
      onClose={onClose}
      content={content}
      tabValue={tabValue}
      setTabValue={setTabValue}
      // ... autres props si nécessaire
    ></GenericModal>
  )
}

export default ProductModal
