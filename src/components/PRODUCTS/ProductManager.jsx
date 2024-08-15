import React from 'react'
import {
  DataGridPremium,
  frFR,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium'
import { Box, Typography } from '@mui/material'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'
import { useCategoryContext } from '../../contexts/CategoryContext' // Importer le contexte des catégories
import { useSuppliers } from '../../contexts/SupplierContext' // Importer le contexte des fournisseurs
import useProductManagerColumns from './hooks/useProductManagerColumns'

const ProductManager = () => {
  const { products } = useProductContextSimplified()
  const { categories } = useCategoryContext() // Accès aux catégories
  const { suppliers } = useSuppliers() // Accès aux fournisseurs
  const columns = useProductManagerColumns({ categories, suppliers }) // Transmettre les catégories et fournisseurs

  return (
    <Box>
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
    </Box>
  )
}

export default ProductManager
