import React, { useState } from 'react'
import {
  DataGridPremium,
  frFR,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium'
import { Box, Typography, Button, Modal, Paper } from '@mui/material'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'
import { useCategoryContext } from '../../contexts/CategoryContext'
import { useSuppliers } from '../../contexts/SupplierContext'
import { useUI } from '../../contexts/UIContext' // Importation du contexte UI
import useProductManagerColumns from './hooks/useProductManagerColumns'
import ProductForm from './ProductForm'

const ProductManager = ({ selectedCategoryId, searchTerm }) => {
  const { products, addProductToContext } = useProductContextSimplified()
  const { categories } = useCategoryContext()
  const { suppliers } = useSuppliers()
  const { showToast } = useUI() // Utilisation du hook UI pour le toast
  const columns = useProductManagerColumns({ categories, suppliers })

  const [isModalOpen, setModalOpen] = useState(false)

  const handleOpenModal = () => setModalOpen(true)
  const handleCloseModal = () => setModalOpen(false)

  const handleProductSubmit = async (newProduct) => {
    try {
      await addProductToContext(newProduct)
      showToast('Produit ajouté avec succès', 'success') // Affiche le toast de succès
      handleCloseModal()
    } catch (error) {
      showToast("Erreur lors de l'ajout du produit", 'error') // Affiche un toast d'erreur en cas de problème
    }
  }

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Créer un produit
      </Button>

      {products.length === 0 ? (
        <Typography variant="h6">Aucun produit trouvé</Typography>
      ) : (
        <DataGridPremium
          rows={products}
          columns={columns}
          pageSize={5}
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
          slots={{ toolbar: GridToolbarQuickFilter }}
          getRowId={(row) => row._id}
        />
      )}

      {/* Modal pour la création de produit */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Paper style={{ margin: 'auto', padding: 20, maxWidth: 600 }}>
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
        </Paper>
      </Modal>
    </Box>
  )
}

export default ProductManager
