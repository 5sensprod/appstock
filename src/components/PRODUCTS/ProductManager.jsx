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
import ReusableModal from '../ui/ReusableModal'
import { useGridPreferences } from '../../contexts/GridPreferenceContext' // Importation du contexte

const ProductManager = ({ selectedCategoryId }) => {
  const { products, addProductToContext, updateProductInContext } =
    useProductContextSimplified()
  const { categories } = useCategoryContext()
  const { suppliers } = useSuppliers()
  const { showToast } = useUI()

  const { gridPreferences, updatePreferences } = useGridPreferences() // Utilisation du contexte des préférences

  const [isModalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  // Gestion de l'ouverture et de la fermeture de la modal
  const handleOpenModal = (product = null) => {
    setEditingProduct(product)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingProduct(null)
  }

  // Gestion de la soumission du produit
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

  // Gestion des changements dans la pagination
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

      {filteredProducts.length === 0 ? (
        <Typography variant="h6">Aucun produit trouvé</Typography>
      ) : (
        <DataGridPremium
          rows={filteredProducts}
          columns={columns}
          paginationModel={gridPreferences.paginationModel} // Utilisation des préférences globales pour la pagination
          onPaginationModelChange={handlePaginationModelChange} // Met à jour la pagination dans le contexte
          pageSize={gridPreferences.paginationModel.pageSize} // Utilise la pageSize des préférences
          onPageSizeChange={(newPageSize) => {
            handlePaginationModelChange({
              ...gridPreferences.paginationModel,
              pageSize: newPageSize,
            })
          }}
          pageSizeOptions={[10, 25, 50]} // Options de taille de page
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
          slots={{ toolbar: GridToolbarQuickFilter }}
          getRowId={(row) => row._id}
          pagination // Active la pagination
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
    </Box>
  )
}

export default ProductManager
