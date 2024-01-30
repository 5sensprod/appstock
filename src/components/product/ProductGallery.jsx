import React, { useState } from 'react'
import { Typography, Box } from '@mui/material'
import { productFactory } from '../factory/productFactory'
import { useProductContext } from '../../contexts/ProductContext'
import GenericModal from '../ui/GenericModal'
import { getProductImageUrl } from '../../utils/imageUtils'
import { useConfig } from '../../contexts/ConfigContext'
import { useNavigate } from 'react-router-dom'

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

  const transformNewLinesToJSX = (text) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ))
  }

  const showProductModal = (product) => {
    // Utiliser l'image mise en avant si disponible, sinon utiliser l'image par défaut
    const imageUrl = product.featuredImage
      ? `${baseUrl}/catalogue/${product._id}/${product.featuredImage}`
      : getProductImageUrl(product.photos, baseUrl).url

    const categoryName = getCategoryName(product.categorie) || 'Non catégorisé'
    const descriptionCourte = product.descriptionCourte || ''
    const description = product.description || ''

    const jsxDescriptionCourte = transformNewLinesToJSX(descriptionCourte)
    const jsxDescription = transformNewLinesToJSX(description)

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
            {jsxDescriptionCourte}
          </Typography>
          <Typography variant="body2" component="div">
            {jsxDescription}
          </Typography>
        </>
      ),
      imageUrl, // Utiliser directement imageUrl ici
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
      {products.map((product) => (
        <Box key={product._id} display="flex" justifyContent="center">
          {productFactory({
            _id: product._id,
            reference: product.reference,
            descriptionCourte: product.descriptionCourte,
            prixVente: product.prixVente,
            photos: product.photos,
            featuredImage: product.featuredImage,
            categorie: product.categorie,
            baseUrl: baseUrl,
            handleOpenModal: () => showProductModal(product),
            redirectToEdit: redirectToEdit,
          }).render()}
        </Box>
      ))}
      <GenericModal
        baseUrl={baseUrl}
        open={modalInfo.open}
        onClose={() => setModalInfo({ ...modalInfo, open: false })}
        title={modalInfo.title}
        content={modalInfo.content}
        imageUrl={modalInfo.imageUrl}
        photos={modalInfo.photos}
      />
    </div>
  )
}

export default ProductGallery
