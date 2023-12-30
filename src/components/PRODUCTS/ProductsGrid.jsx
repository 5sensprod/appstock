import React, { useState, useMemo, useEffect } from 'react'
import { DataGridPro, frFR, GridRowModes } from '@mui/x-data-grid-pro'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'
import useFilteredProducts from './hooks/useFilteredProducts'
import useColumns from './hooks/useColumns'
import CustomToolbar from './CustomToolbar'

const ProductsGrid = ({ selectedCategoryId }) => {
  const { addProduct, updateProductInContext } = useProductContextSimplified()
  const filteredProducts = useFilteredProducts(selectedCategoryId)

  const [rows, setRows] = useState(filteredProducts)
  const initialRowModesModel = useMemo(() => {
    return filteredProducts.reduce((model, product) => {
      model[product._id] = { mode: GridRowModes.View }
      return model
    }, {})
  }, [filteredProducts])
  const [rowModesModel, setRowModesModel] = useState(initialRowModesModel)

  const { columns } = useColumns(
    rowModesModel,
    setRowModesModel,
    setRows,
    addProduct,
  )

  useEffect(() => {
    const handleProductDeleted = (event) => {
      const deletedProductId = event.detail.productId
      setRows((prevRows) =>
        prevRows.filter((row) => row._id !== deletedProductId),
      )
    }

    document.addEventListener('product-deleted', handleProductDeleted)

    // Nettoyage
    return () => {
      document.removeEventListener('product-deleted', handleProductDeleted)
    }
  }, [])

  const processRowUpdate = async (newRow, oldRow) => {
    try {
      // Vérifiez si newRow et newRow.id sont définis
      if (!newRow || typeof newRow.id === 'undefined') {
        throw new Error(
          "La nouvelle ligne ou l'identifiant de la ligne est indéfini.",
        )
      }

      if (newRow.isNew || newRow.id.startsWith('new-')) {
        // Supprimez l'attribut 'id' temporaire avant d'envoyer à l'API
        const { id, ...productData } = newRow
        const addedProduct = await addProduct(productData)

        // Remplacez la ligne temporaire par la nouvelle ligne ajoutée
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === id ? { ...addedProduct, isNew: false } : row,
          ),
        )
      } else {
        // Mise à jour d'une ligne existante avec updateProductInContext
        await updateProductInContext(newRow._id, newRow)
        setRows((prevRows) =>
          prevRows.map((row) => (row._id === newRow._id ? { ...newRow } : row)),
        )
      }
      return newRow
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error)
      throw error // Pour déclencher handleProcessRowUpdateError
    }
  }

  const handleProcessRowUpdateError = (error) => {
    console.error('Erreur lors de la mise à jour de la ligne :', error)
  }
  const handleAddClick = () => {
    const tempId = 'new-' + Date.now() // Identifiant temporaire unique
    const newRow = {
      id: tempId,
      // Initialisez seulement les champs absolument nécessaires avec des valeurs par défaut
      reference: '', // S'il est important de commencer avec une référence vide
      dateSoumission: new Date().toISOString(), // S'il est important de fixer une date par défaut
      // ...autres champs absolument nécessaires
    }

    setRows((prevRows) => [...prevRows, newRow])
    setRowModesModel((prev) => ({
      ...prev,
      [tempId]: { mode: GridRowModes.Edit },
    }))
  }

  return (
    <DataGridPro
      localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
      rows={rows}
      getRowId={(row) => row._id || row.id}
      columns={columns}
      rowModesModel={rowModesModel}
      onRowModesModelChange={setRowModesModel}
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
