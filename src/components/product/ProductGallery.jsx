import React, { useState } from 'react'
import { Box, Stack, Pagination, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useProductContext } from '../../contexts/ProductContext'
import { useConfig } from '../../contexts/ConfigContext'
import { productFactory } from '../factory/productFactory'

const ProductItem = ({
  product,
  getCategoryPath,
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
      categoryName: getParentCategoryName(product.categorie), // Utilisez-la ici
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
  const { categories, getCategoryPath, getParentCategoryName } =
    useProductContext()
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 10

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

  // const getCategoryName = (categoryId) => {
  //   const category = categories.find((c) => c._id === categoryId)
  //   return category ? category.name : 'Non catégorisé'
  // }

  // const getCategoryPath = (categoryId) => {
  //   let path = []
  //   let currentCategory = categories.find((cat) => cat._id === categoryId)

  //   while (currentCategory) {
  //     path.unshift(currentCategory.name) // Ajoute le nom de la catégorie au début du chemin
  //     // Cherche la catégorie parent jusqu'à ce qu'il n'y ait plus de parent
  //     currentCategory = categories.find(
  //       (cat) => cat._id === currentCategory.parentId,
  //     )
  //   }

  //   return path.join(' > ') // Rejoint tous les noms avec ' > ' pour former un chemin
  // }

  // const getParentCategoryName = (categoryId) => {
  //   let currentCategory = categories.find((cat) => cat._id === categoryId)

  //   // Remonte la hiérarchie jusqu'à trouver la catégorie parente la plus élevée
  //   while (currentCategory && currentCategory.parentId) {
  //     currentCategory = categories.find(
  //       (cat) => cat._id === currentCategory.parentId,
  //     )
  //   }

  //   return currentCategory ? currentCategory.name : 'Non catégorisé'
  // }

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
                getCategoryPath={getCategoryPath} // Si vous souhaitez également passer cette fonction
                getParentCategoryName={getParentCategoryName}
                baseUrl={baseUrl}
                redirectToEdit={redirectToEdit}
              />
            ))}
          </Stack>
        </>
      )}
      z
    </>
  )
}

export default ProductGallery
