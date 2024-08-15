import React from 'react'
import {
  DataGridPremium,
  frFR,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium'
import { Box, Typography } from '@mui/material'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'
import { useCategoryContext } from '../../contexts/CategoryContext'
import { useSuppliers } from '../../contexts/SupplierContext'
import useProductManagerColumns from './hooks/useProductManagerColumns'

const ProductManager = ({ selectedCategoryId, searchTerm }) => {
  const { products } = useProductContextSimplified()
  const { categories } = useCategoryContext()
  const { suppliers } = useSuppliers()
  const columns = useProductManagerColumns({ categories, suppliers })

  // Filtrer les produits par catégorie si une catégorie est sélectionnée
  const filteredProducts = products.filter((product) => {
    if (!selectedCategoryId) {
      return true // Si aucune catégorie n'est sélectionnée, afficher tous les produits
    }
    return product.categorie === selectedCategoryId // Afficher uniquement les produits qui correspondent à la catégorie sélectionnée
  })

  return (
    <Box>
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
    </Box>
  )
}

export default ProductManager
