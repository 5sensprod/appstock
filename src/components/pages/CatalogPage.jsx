import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EditBulkProduct from '../product/EditBulkProduct'
import { useProductContext } from '../../contexts/ProductContext'
import { useUI } from '../../contexts/UIContext'
import { deleteProduct } from '../../api/productService'
import ProductSearch from '../product/ProductSearch'
import { Modal, Box } from '@mui/material'
import SelectCategory from '../category/SelectCategory'
import useSearch from '../hooks/useSearch'
import BulkEditButton from '../ui/BulkEditButton'
import ProductCatalog from '../product/ProductCatalog'

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
    <>
      <div style={{ width: '100%' }}>
        <Box display="flex" alignItems="center" gap={2} my={2}>
          <ProductSearch />
          <SelectCategory
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={handleCategoryChange}
          />
          <BulkEditButton
            isDisabled={selectedProducts.size < 2}
            handleOpenModal={handleOpenModal}
          />
        </Box>
        <ProductCatalog
          products={filteredProducts}
          onSelectionChange={handleSelection}
          redirectToEdit={redirectToEdit}
          promptDelete={promptDelete}
          categories={categories}
        />
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
            <EditBulkProduct handleCloseModal={handleCloseModal} />
          </div>
        </Modal>
      </div>
    </>
  )
}

export default CatalogPage
