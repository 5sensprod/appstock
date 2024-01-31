// src/components/PRODUCTS/ProductModal.jsx
import React from 'react'
import { Typography } from '@mui/material'
import GenericModal from '../ui/GenericModal'
import DOMPurify from 'dompurify'

const ProductModal = ({ product, baseUrl, open, onClose }) => {
  if (!product) return null

  const imageUrl = product.featuredImage
    ? `${baseUrl}/catalogue/${product._id}/${product.featuredImage}`
    : `${baseUrl}/catalogue/default/default.png`

  const categoryName = product.categoryName || 'Non catégorisé'
  const cleanDescription = DOMPurify.sanitize(product.description || '')

  return (
    <GenericModal
      open={open}
      onClose={onClose}
      title={product.reference || 'Titre non disponible'}
      content={
        <>
          {product.reference && (
            <Typography variant="h6" component="div">
              {product.reference}
            </Typography>
          )}
          <Typography variant="body1" component="div">
            {categoryName}
          </Typography>
          <Typography variant="body1" component="div">
            <span dangerouslySetInnerHTML={{ __html: cleanDescription }} />
          </Typography>
        </>
      }
      imageUrl={imageUrl}
    />
  )
}

export default ProductModal
