import React, { useState } from 'react'
import { Typography, Tabs, Tab, Box } from '@mui/material'
import { productFactory } from '../factory/productFactory'
import { useProductContext } from '../../contexts/ProductContext'
import GenericModal from '../ui/GenericModal'
import { getProductImageUrl } from '../../utils/imageUtils' // Assurez-vous que cette fonction est correctement importée

const ProductGallery = ({ products }) => {
  const { baseUrl } = useProductContext()
  const { categories } = useProductContext()
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
    const imageUrl = getProductImageUrl(product.photos, baseUrl)
    const categoryName = getCategoryName(product.categorie) // Récupérer le nom de la catégorie
    const cleanedDescriptionCourte = product.descriptionCourte.replace(
      'Chapeau : ',
      '',
    )
    const jsxDescriptionCourte = transformNewLinesToJSX(
      cleanedDescriptionCourte,
    )
    const jsxDescription = transformNewLinesToJSX(product.description)

    setModalInfo({
      open: true,
      title: product.reference,
      content: (
        <>
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
      imageUrl,
    })
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {products.map((product) => (
        <div key={product._id}>
          {productFactory(
            product._id,
            product.reference,
            product.descriptionCourte,
            product.prixVente,
            product.photos,
            product.categorie,
            baseUrl,
            () => showProductModal(product),
          ).render()}
        </div>
      ))}
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
