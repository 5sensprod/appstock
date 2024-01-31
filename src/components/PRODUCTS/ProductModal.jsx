// src/components/PRODUCTS/ProductModal.jsx
import React from 'react'
import { Typography } from '@mui/material'
import GenericModal from '../ui/GenericModal'
import DOMPurify from 'dompurify'
import ShowProductSimple from './ShowProductSimple'

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
      content={<ShowProductSimple productInfo={product} />}
      imageUrl={imageUrl}
    />
  )
}

export default ProductModal
