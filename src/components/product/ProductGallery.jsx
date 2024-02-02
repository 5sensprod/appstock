import React, { useState } from 'react'
import { Box, Stack, Pagination } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useProductContext } from '../../contexts/ProductContext'
import { useConfig } from '../../contexts/ConfigContext'
import { productFactory } from '../factory/productFactory'

const ProductItem = ({ product, getCategoryName, baseUrl, redirectToEdit }) => (
  <Box key={product._id} display="flex" justifyContent="center">
    {productFactory({
      _id: product._id,
      reference: product.reference,
      description: product.description,
      prixVente: product.prixVente,
      featuredImage: product.featuredImage,
      categoryName: getCategoryName(product.categorie),
      baseUrl: baseUrl,
      redirectToEdit: redirectToEdit,
    }).render()}
  </Box>
)

const CustomPagination = ({
  productsPerPage,
  totalProducts,
  currentPage,
  paginate,
}) => {
  const pageNumbers = Array.from(
    { length: Math.ceil(totalProducts / productsPerPage) },
    (_, i) => i + 1,
  )

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

const ProductGallery = ({ products }) => {
  const { baseUrl } = useConfig()
  const { categories } = useProductContext()
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 10

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  )

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
        {currentProducts.map((product) => (
          <ProductItem
            key={product._id}
            product={product}
            getCategoryName={getCategoryName}
            baseUrl={baseUrl}
            redirectToEdit={redirectToEdit}
          />
        ))}
      </Stack>
    </>
  )
}

export default ProductGallery
