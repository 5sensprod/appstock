import React from 'react'
import { DataGridPro, frFR, GridToolbar } from '@mui/x-data-grid-pro'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'
import useFilteredProducts from './hooks/useFilteredProducts'
import useColumns from './hooks/useColumns'

const ProductsGrid = ({ selectedCategoryId }) => {
  const { updateProductInContext } = useProductContextSimplified()

  const filteredProducts = useFilteredProducts(selectedCategoryId)
  const { columns, editRowsModel } = useColumns()

  const processRowUpdate = async (newRow, oldRow) => {
    try {
      // Appel à la fonction du contexte pour mettre à jour le produit sur le serveur
      await updateProductInContext(newRow._id, newRow)
      return newRow
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error)
      throw error // Important pour déclencher onProcessRowUpdateError
    }
  }

  const handleProcessRowUpdateError = (error) => {
    // Gérer l'erreur ici (par exemple, afficher une notification à l'utilisateur)
    console.error('Erreur lors de la mise à jour de la ligne :', error)
  }

  return (
    <DataGridPro
      localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
      rows={filteredProducts}
      columns={columns}
      editRowsModel={editRowsModel}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 10,
          },
        },
      }}
      pageSizeOptions={[10, 25, 50]}
      pagination
      checkboxSelection
      checkboxSelectionVisibleOnly
      getRowId={(row) => row._id}
      processRowUpdate={processRowUpdate}
      onProcessRowUpdateError={handleProcessRowUpdateError}
      slots={{
        toolbar: GridToolbar,
      }}
      disableRowSelectionOnClick
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
      }}
      style={{ width: '100%' }}
    />
  )
}

export default ProductsGrid
