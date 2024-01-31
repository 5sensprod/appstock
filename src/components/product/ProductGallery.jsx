import React from 'react'
import { Box } from '@mui/material'
import { productFactory } from '../factory/productFactory'
import { useProductContext } from '../../contexts/ProductContext'
import { useConfig } from '../../contexts/ConfigContext'
import { useNavigate } from 'react-router-dom'

const ProductGallery = ({ products }) => {
  const { baseUrl } = useConfig()
  const { categories } = useProductContext()
  const navigate = useNavigate()

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c._id === categoryId)
    return category ? category.name : 'Non catégorisé'
  }

  const redirectToEdit = (productId) => {
    navigate(`/edit-product/${productId}`)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '30px',
        width: '100%',
        marginTop: '30px',
        justifyContent: 'center',
      }}
    >
      {products.map((product) => {
        const categoryName = getCategoryName(product.categorie)

        return (
          <Box key={product._id} display="flex" justifyContent="center">
            {productFactory({
              _id: product._id,
              reference: product.reference,
              description: product.description,
              prixVente: product.prixVente,
              featuredImage: product.featuredImage,
              categoryName: categoryName,
              baseUrl: baseUrl,
              redirectToEdit: redirectToEdit,
            }).render()}
          </Box>
        )
      })}
    </div>
  )
}

export default ProductGallery
