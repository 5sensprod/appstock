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
  const { products, addProductToContext } = useProductContextSimplified()
  const { categories } = useCategoryContext()
  const { suppliers } = useSuppliers()
  const { showToast } = useUI()
  const columns = useProductManagerColumns({ categories, suppliers })

  const [isModalOpen, setModalOpen] = useState(false)

  const handleOpenModal = () => setModalOpen(true)
  const handleCloseModal = () => setModalOpen(false)

  const handleProductSubmit = async (newProduct) => {
    try {
      await addProductToContext(newProduct)
      showToast('Produit ajouté avec succès', 'success')
      handleCloseModal()
    } catch (error) {
      showToast("Erreur lors de l'ajout du produit", 'error')
    }
  }

  // Filtrer les produits par catégorie si une catégorie est sélectionnée
  const filteredProducts = products.filter((product) => {
    if (!selectedCategoryId) {
      return true // Si aucune catégorie n'est sélectionnée, afficher tous les produits
    }
    return product.categorie === selectedCategoryId // Afficher uniquement les produits qui correspondent à la catégorie sélectionnée
  })

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Créer un produit
      </Button>

      {filteredProducts.length === 0 ? (
        <Typography variant="h6">Aucun produit trouvé</Typography>
      ) : (
        <DataGridPremium
          rows={filteredProducts} // Utilisation des produits filtrés
          columns={columns}
          pageSize={5}
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
          slots={{ toolbar: GridToolbarQuickFilter }}
          getRowId={(row) => row._id}
        />
      )}

      {/* Utilisation de ReusableModal */}
      <ReusableModal open={isModalOpen} onClose={handleCloseModal}>
        <Typography variant="h6">Créer un produit</Typography>
        <ProductForm
          initialProduct={{
            reference: '',
            marque: '',
            prixAchat: 0,
            prixVente: 0,
            stock: 0,
            gencode: '',
            categorie: '',
            supplierId: '',
            tva: 20,
          }}
          onSubmit={handleProductSubmit}
          onCancel={handleCloseModal}
        />
      </ReusableModal>
    </Box>
  )
}

export default ProductManager
