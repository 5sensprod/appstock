import React, { useState } from 'react'
import { Typography, Box } from '@mui/material'
import { productFactory } from '../factory/productFactory'
import { useProductContext } from '../../contexts/ProductContext'
import GenericModal from '../ui/GenericModal'
import { useConfig } from '../../contexts/ConfigContext'
import { useNavigate } from 'react-router-dom'
import DOMPurify from 'dompurify'

const ProductGallery = ({ products }) => {
  const { baseUrl } = useConfig()
  const { categories } = useProductContext()
  const navigate = useNavigate()

  const [modalInfo, setModalInfo] = useState({
    open: false,
    title: '',
    content: '',
    imageUrl: '',
  })

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c._id === categoryId)
    return category ? category.name : 'Non catégorisé'
  }

  const showProductModal = (product) => {
    const imageUrl = product.featuredImage
      ? `${baseUrl}/catalogue/${product._id}/${product.featuredImage}`
      : `${baseUrl}/catalogue/default/default.png`

    const categoryName = getCategoryName(product.categorie) || 'Non catégorisé'
    const cleanDescription = DOMPurify.sanitize(product.description || '')

    setModalInfo({
      open: true,
      title: product.reference || 'Titre non disponible',
      content: (
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
      ),
      imageUrl,
    })
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
              handleOpenModal: () => showProductModal(product),
              redirectToEdit: redirectToEdit,
            }).render()}
          </Box>
        )
      })}
      <GenericModal
        open={modalInfo.open}
        onClose={() => setModalInfo({ ...modalInfo, open: false })}
        title={modalInfo.title}
        content={modalInfo.content}
        imageUrl={modalInfo.imageUrl}
      />
    </div>
  )
}

export default ProductGallery
