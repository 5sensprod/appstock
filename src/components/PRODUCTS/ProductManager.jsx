import React from 'react'
import {
  DataGridPremium,
  frFR,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium'
import { Box, Typography, Button } from '@mui/material'
import { useCategoryContext } from '../../contexts/CategoryContext'
import { useSuppliers } from '../../contexts/SupplierContext'
import useProductManagerColumns from './hooks/useProductManagerColumns'
import ProductForm from './ProductForm'
import BulkEditForm from './BulkEditForm'
import ReusableModal from '../ui/ReusableModal'
import { useProductManagerLogic } from './hooks/useProductManagerLogic'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified' // Ajout pour utiliser les produits

const ProductManager = ({ selectedCategoryId }) => {
  const { products } = useProductContextSimplified() // Récupération des produits depuis le contexte
  const { categories } = useCategoryContext()
  const { suppliers } = useSuppliers()

  const {
    isModalOpen,
    isBulkEditModalOpen,
    editingProduct,
    rowSelectionModel,
    handleOpenModal,
    handleCloseModal,
    handleBulkEditModalOpen,
    handleBulkEditModalClose,
    handleProductSubmit,
    handleBulkEditSubmit,
    handleDeleteProduct,
    setRowSelectionModel,
  } = useProductManagerLogic()

  const columns = useProductManagerColumns({
    categories,
    suppliers,
    handleOpenModal,
    handleDeleteProduct,
  })

  const filteredProducts = products.filter((product) => {
    if (!selectedCategoryId) return true
    return product.categorie === selectedCategoryId
  })

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal()}
      >
        Créer un produit
      </Button>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleBulkEditModalOpen}
        disabled={rowSelectionModel.length < 2}
        style={{ marginLeft: 16 }}
      >
        Modifier en masse
      </Button>

      {filteredProducts.length === 0 ? (
        <Typography variant="h6">Aucun produit trouvé</Typography>
      ) : (
        <DataGridPremium
          rows={filteredProducts}
          columns={columns}
          paginationModel={{ page: 0, pageSize: 10 }}
          pageSizeOptions={[10, 25, 50]}
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
          slots={{ toolbar: GridToolbarQuickFilter }}
          getRowId={(row) => row._id}
          pagination
          checkboxSelection
          onRowSelectionModelChange={(newSelection) =>
            setRowSelectionModel(newSelection)
          }
          rowSelectionModel={rowSelectionModel}
        />
      )}

      <ReusableModal open={isModalOpen} onClose={handleCloseModal}>
        <Typography variant="h6">
          {editingProduct ? 'Modifier le produit' : 'Créer un produit'}
        </Typography>
        <ProductForm
          initialProduct={
            editingProduct || {
              reference: '',
              marque: '',
              prixAchat: 0,
              prixVente: 0,
              stock: 0,
              gencode: '',
              categorie: '',
              supplierId: '',
              tva: 20,
            }
          }
          onSubmit={handleProductSubmit}
          onCancel={handleCloseModal}
        />
      </ReusableModal>

      <ReusableModal
        open={isBulkEditModalOpen}
        onClose={handleBulkEditModalClose}
      >
        <Typography variant="h6">Modifier les produits sélectionnés</Typography>
        <BulkEditForm
          onSubmit={handleBulkEditSubmit}
          onCancel={handleBulkEditModalClose}
          selectedProducts={rowSelectionModel}
        />
      </ReusableModal>
    </Box>
  )
}

export default ProductManager
