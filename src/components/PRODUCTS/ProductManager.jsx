import React, { useState } from 'react'
import {
  DataGridPremium,
  frFR,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium'
import { Box, Typography, Button } from '@mui/material'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'
import { useCategoryContext } from '../../contexts/CategoryContext'
import { useSuppliers } from '../../contexts/SupplierContext'
import { useUI } from '../../contexts/UIContext'
import useProductManagerColumns from './hooks/useProductManagerColumns'
import ProductForm from './ProductForm'
import BulkEditForm from './BulkEditForm'
import ReusableModal from '../ui/ReusableModal'
import { useGridPreferences } from '../../contexts/GridPreferenceContext'

const ProductManager = ({ selectedCategoryId }) => {
  const {
    products,
    addProductToContext,
    updateProductInContext,
    bulkUpdateProductsInContext,
  } = useProductContextSimplified()
  const { categories } = useCategoryContext()
  const { suppliers } = useSuppliers()
  const { showToast } = useUI()

  const { gridPreferences, updatePreferences } = useGridPreferences()

  const [isModalOpen, setModalOpen] = useState(false)
  const [isBulkEditModalOpen, setBulkEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [rowSelectionModel, setRowSelectionModel] = useState([])

  const handleOpenModal = (product = null) => {
    setEditingProduct(product)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingProduct(null)
  }

  const handleBulkEditModalOpen = () => {
    setBulkEditModalOpen(true)
  }

  const handleBulkEditModalClose = () => {
    setBulkEditModalOpen(false)
  }

  const handleProductSubmit = async (productData) => {
    try {
      if (editingProduct) {
        await updateProductInContext(editingProduct._id, productData)
        showToast('Produit modifié avec succès', 'success')
      } else {
        await addProductToContext(productData)
        showToast('Produit ajouté avec succès', 'success')
      }
      handleCloseModal()
    } catch (error) {
      showToast(
        "Erreur lors de l'ajout ou de la modification du produit",
        'error',
      )
    }
  }

  const handleBulkEditSubmit = async (updates) => {
    try {
      await bulkUpdateProductsInContext(updates) // Envoi direct des données
      showToast('Produits modifiés avec succès', 'success')
      handleBulkEditModalClose()
    } catch (error) {
      showToast('Erreur lors de la modification des produits', 'error')
    }
  }

  const columns = useProductManagerColumns({
    categories,
    suppliers,
    handleOpenModal,
  })

  // Filtrer les produits par catégorie si une catégorie est sélectionnée
  const filteredProducts = products.filter((product) => {
    if (!selectedCategoryId) return true
    return product.categorie === selectedCategoryId
  })

  const handlePaginationModelChange = (model) => {
    updatePreferences({
      paginationModel: model,
    })
  }

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
        disabled={rowSelectionModel.length < 2} // Désactiver si moins de 2 lignes sélectionnées
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
          paginationModel={gridPreferences.paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          pageSize={gridPreferences.paginationModel.pageSize}
          onPageSizeChange={(newPageSize) => {
            handlePaginationModelChange({
              ...gridPreferences.paginationModel,
              pageSize: newPageSize,
            })
          }}
          pageSizeOptions={[10, 25, 50]}
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
          slots={{ toolbar: GridToolbarQuickFilter }}
          getRowId={(row) => row._id}
          pagination
          checkboxSelection
          onRowSelectionModelChange={(newSelection) =>
            setRowSelectionModel(newSelection)
          } // Gère la sélection
          rowSelectionModel={rowSelectionModel} // Liaison de la sélection au modèle d'état
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
