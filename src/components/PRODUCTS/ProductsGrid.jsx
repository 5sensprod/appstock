import React from 'react'
import { DataGridPro, frFR } from '@mui/x-data-grid-pro'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'
import useFilteredProducts from './hooks/useFilteredProducts'
import useColumns from './hooks/useColumns'
import CustomToolbar from './CustomToolbar'

const ProductsGrid = ({ selectedCategoryId }) => {
  const { updateProductInContext } = useProductContextSimplified()

  const filteredProducts = useFilteredProducts(selectedCategoryId)
  const { columns, editRowsModel } = useColumns()

  const processRowUpdate = async (newRow, oldRow) => {
    try {
      await updateProductInContext(newRow._id, newRow)
      return newRow
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error)
      throw error
    }
  }

  const handleProcessRowUpdateError = (error) => {
    console.error('Erreur lors de la mise à jour de la ligne :', error)
  }

  const handleAddClick = () => {
    // Logique pour ajouter une nouvelle ligne
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
        toolbar: CustomToolbar,
      }}
      disableRowSelectionOnClick
      slotProps={{
        toolbar: {
          showQuickFilter: true,
          onAddClick: handleAddClick,
        },
      }}
      style={{ width: '100%' }}
    />
  )
}

export default ProductsGrid
