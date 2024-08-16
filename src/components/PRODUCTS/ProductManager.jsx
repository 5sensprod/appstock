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

const ProductManager = ({ selectedCategoryId, searchTerm }) => {
  const { products, addProductToContext, updateProductInContext } =
    useProductContextSimplified()
  const { categories } = useCategoryContext()
  const { suppliers } = useSuppliers()
  const { showToast } = useUI()

  const [isModalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const handleOpenModal = (product = null) => {
    setEditingProduct(product)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingProduct(null)
  }

  const handleProductSubmit = async (productData) => {
    try {
      if (editingProduct) {
        // Mise à jour d'un produit existant
        await updateProductInContext(editingProduct._id, productData)
        showToast('Produit modifié avec succès', 'success')
      } else {
        // Ajout d'un nouveau produit
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
    if (!selectedCategoryId) {
      return true
    }
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

      {filteredProducts.length === 0 ? (
        <Typography variant="h6">Aucun produit trouvé</Typography>
      ) : (
        <DataGridPremium
          rows={filteredProducts}
          columns={columns} // Utilisation des colonnes avec bouton d'édition
          pageSize={5}
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
          slots={{ toolbar: GridToolbarQuickFilter }}
          getRowId={(row) => row._id}
        />
      )}

      {/* Utilisation de ReusableModal pour la création/modification de produit */}
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
