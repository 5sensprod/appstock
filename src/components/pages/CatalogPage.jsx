import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EditBulkProduct from '../product/EditBulkProduct'
import { useProductContext } from '../../contexts/ProductContext'
import { useUI } from '../../contexts/UIContext'
import { deleteProduct } from '../../api/productService'
import ProductSearch from '../product/ProductSearch'
import SelectCategory from '../category/SelectCategory'
import useSearch from '../hooks/useSearch'
import BulkEditButton from '../ui/BulkEditButton'
import ProductCatalog from '../product/ProductCatalog'
import ProductGallery from '../product/ProductGallery'
import { Modal, Box, Button, IconButton } from '@mui/material'
import ViewListIcon from '@mui/icons-material/ViewList'
import ViewComfyIcon from '@mui/icons-material/ViewComfy'

const CatalogPage = () => {
  const {
    categories,
    products,
    setProducts,
    setSelectedProducts,
    selectedProducts,
    searchTerm,
    selectedCategoryId,
    handleCategoryChange,
  } = useProductContext()

  const { showConfirmDialog, showToast } = useUI()
  const [viewMode, setViewMode] = useState('table')
  const [openModal, setOpenModal] = useState(false)
  const filteredProducts = useSearch(products, searchTerm, selectedCategoryId)
  const navigate = useNavigate()

  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  const redirectToEdit = (productId) => {
    navigate(`/edit-product/${productId}`)
  }

  const promptDelete = (product) => {
    showConfirmDialog(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer le produit "${product.reference}" ? Cette action est irréversible.`,
      () => handleDelete(product),
    )
  }

  const handleDelete = async (product) => {
    try {
      await deleteProduct(product._id)
      const updatedProducts = products.filter((p) => p._id !== product._id)
      setProducts(updatedProducts)
      showToast(
        `Produit "${product.reference}" supprimé avec succès`,
        'success',
      )
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error)
      showToast(`Erreur lors de la suppression du produit`, 'error')
    }
  }

  const handleSelection = (selectionModel) => {
    setSelectedProducts(new Set(selectionModel))
  }

  return (
    <div style={{ width: '100%' }}>
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        my={2}
        justifyContent={'space-between'}
      >
        <Box display="flex" alignItems="center" gap={2} my={2} flex={1}>
          <Box width={'30%'}>
            <SelectCategory
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={handleCategoryChange}
            />
          </Box>
          <Box width={'70%'}>
            <ProductSearch />
          </Box>
        </Box>
        <Box display="flex" gap={2}>
          <BulkEditButton
            isDisabled={selectedProducts.size < 2}
            handleOpenModal={handleOpenModal}
          />
          {viewMode === 'gallery' && (
            <IconButton
              size="small"
              color="primary"
              onClick={() => setViewMode('table')}
            >
              <ViewListIcon />
            </IconButton>
          )}

          {viewMode === 'table' && (
            <IconButton
              size="small"
              color="primary"
              onClick={() => setViewMode('gallery')}
            >
              <ViewComfyIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      {viewMode === 'table' ? (
        <ProductCatalog
          products={filteredProducts}
          onSelectionChange={handleSelection}
          redirectToEdit={redirectToEdit}
          promptDelete={promptDelete}
          categories={categories}
        />
      ) : (
        <ProductGallery products={filteredProducts} />
      )}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ backgroundColor: 'white', padding: '20px' }}>
          <EditBulkProduct
            handleCloseModal={handleCloseModal}
            selectedProductIds={selectedProducts}
          />
        </div>
      </Modal>
    </div>
  )
}

export default CatalogPage
