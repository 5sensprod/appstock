import React, { useState, useEffect } from 'react'
import { Box, Stack, Pagination, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useProductContext } from '../../contexts/ProductContext'
import { useConfig } from '../../contexts/ConfigContext'
import { productFactory } from '../factory/productFactory'
import { useGridPreferences } from '../../contexts/GridPreferenceContext'

const ProductItem = ({
  product,
  getParentCategoryName,
  baseUrl,
  redirectToEdit,
}) => (
  <Box key={product._id} display="flex" justifyContent="center">
    {productFactory({
      _id: product._id,
      reference: product.reference,
      description: product.description,
      prixVente: product.prixVente,
      featuredImage: product.featuredImage,
      categoryName: getParentCategoryName(product.categorie),
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
  const { getParentCategoryName } = useProductContext()
  const navigate = useNavigate()

  // const [currentPage, setCurrentPage] = useState(1)
  const { currentPage, setCurrentPage, selectedProductId } =
    useGridPreferences() // Modifier ici
  const productsPerPage = 10

  useEffect(() => {
    // Si un produit était sélectionné, assurez-vous que la page contenant ce produit est affichée
    if (selectedProductId) {
      const selectedProductIndex = products.findIndex(
        (p) => p._id === selectedProductId,
      )
      if (selectedProductIndex >= 0) {
        const pageContainingProduct = Math.ceil(
          (selectedProductIndex + 1) / productsPerPage,
        )
        setCurrentPage(pageContainingProduct)
      }
    }
  }, [selectedProductId, products, setCurrentPage, productsPerPage])

  // Tri des produits par date de soumission en ordre décroissant
  const sortedProducts = products.sort(
    (a, b) => new Date(b.dateSoumission) - new Date(a.dateSoumission),
  )

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  )

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const redirectToEdit = (productId) => {
    navigate(`/edit-product/${productId}`)
  }

  return (
    <>
      {currentProducts.length === 0 ? (
        <Typography variant="h6">Aucun produit trouvé</Typography>
      ) : (
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
                getParentCategoryName={getParentCategoryName}
                baseUrl={baseUrl}
                redirectToEdit={redirectToEdit}
              />
            ))}
          </Stack>
        </>
      )}
    </>
  )
}

export default ProductGallery
