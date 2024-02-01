import React, { useState } from 'react'
import { Box, Stack, Pagination } from '@mui/material'
import { productFactory } from '../factory/productFactory'
import { useProductContext } from '../../contexts/ProductContext'
import { useConfig } from '../../contexts/ConfigContext'
import { useNavigate } from 'react-router-dom'

const ProductGallery = ({ products }) => {
  const { baseUrl } = useConfig()
  const { categories } = useProductContext()
  const navigate = useNavigate()

  // Configuration de la pagination
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 10

  // Obtenir les produits actuels pour la page
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  )

  // Gérer le changement de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c._id === categoryId)
    return category ? category.name : 'Non catégorisé'
  }

  const redirectToEdit = (productId) => {
    navigate(`/edit-product/${productId}`)
  }

  return (
    <>
      <CustomPagination
        productsPerPage={productsPerPage}
        totalProducts={products.length}
        currentPage={currentPage}
        paginate={paginate}
      />
      <Stack
        direction="row"
        justifyContent="center"
        mt={2}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          width: '100%',
          gap: '10px',
        }}
      >
        {currentProducts.map((product) => {
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
      </Stack>
    </>
  )
}

export default ProductGallery

// Composant Pagination (à créer ou utiliser une bibliothèque existante)
const CustomPagination = ({
  productsPerPage,
  totalProducts,
  currentPage,
  paginate,
}) => {
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <Stack spacing={2} direction="row" justifyContent="center">
      <Pagination
        count={pageNumbers.length}
        page={currentPage}
        onChange={(event, page) => paginate(page)}
        shape="rounded"
      />
    </Stack>
  )
}
