import React, { useState } from 'react'
import {
  DataGridPro,
  frFR,
  GridRowEditStopReasons,
  GridRowModes,
} from '@mui/x-data-grid-pro'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'
import useFilteredProducts from './hooks/useFilteredProducts'
import useColumns from './hooks/useColumns'
import CustomToolbar from './CustomToolbar'

const ProductsGrid = ({ selectedCategoryId }) => {
  const {
    products,
    setProducts,
    addProductToContext,
    updateProductInContext,
    deleteProductFromContext,
  } = useProductContextSimplified()

  const filteredProducts = useFilteredProducts(selectedCategoryId)
  const [isRowNew, setIsRowNew] = useState({})
  const [rowModesModel, setRowModesModel] = useState({})
  const [editingRow, setEditingRow] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.cellFocusOut) {
      if (!event?.defaultMuiPrevented) {
        event.defaultMuiPrevented = true
      }
    }
  }

  const handleAddClick = () => {
    const tempId = `temp-${Date.now()}`
    const newProduct = {
      _id: tempId,
      reference: '',
      prixVente: 0,
      prixAchat: 0,
      stock: 0,
      categorie: '',
      marque: '',
      gencode: '',
      tva: 0,
    }

    setIsRowNew({ ...isRowNew, [tempId]: true })
    setProducts([newProduct, ...products])
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [tempId]: { mode: GridRowModes.Edit },
    }))
  }

  const handleEdit = (row) => {
    setEditingRow({ ...row })
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [row._id]: { mode: GridRowModes.Edit },
    }))
  }

  const handleSave = async (row) => {
    setIsUpdating(true)
    if (!row) {
      console.error('Erreur : la ligne à sauvegarder est undefined.')
      return
    }

    if (isRowNew[row._id]) {
      try {
        setIsRowNew((currentIsRowNew) => {
          const newIsRowNew = { ...currentIsRowNew }
          delete newIsRowNew[row._id]
          return newIsRowNew
        })
      } catch (error) {
        console.error("Erreur lors de l'ajout du produit:", error)
      }
    } else {
      await updateProductInContext(row._id, row)
    }
    setEditingRow(null)
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [row._id]: { mode: GridRowModes.View },
    }))
  }

  const handleCancel = (row) => {
    setIsUpdating(false)
    // Si la ligne est nouvelle (non enregistrée), la retirer du tableau des produits
    if (isRowNew[row._id]) {
      console.log(`Annulation de l'ajout d'une nouvelle ligne ID: ${row._id}`)
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product._id !== row._id),
      )
      setIsRowNew((currentIsRowNew) => {
        const newIsRowNew = { ...currentIsRowNew }
        delete newIsRowNew[row._id]
        return newIsRowNew
      })
    }
    // Sinon, rétablir les valeurs originales pour une ligne existante
    else if (editingRow) {
      console.log(
        `Restauration des valeurs originales pour la ligne ID: ${row._id}`,
      )
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product._id === editingRow._id ? editingRow : product,
        ),
      )
    }

    // Nettoyer l'état de l'édition et sortir du mode d'édition
    setEditingRow(null)
    setRowModesModel((oldModel) => {
      console.log(`Sortie du mode d'édition pour la ligne ID: ${row._id}`)
      return { ...oldModel, [row._id]: { mode: GridRowModes.View } }
    })
  }

  const handleDelete = async (row) => {
    await deleteProductFromContext(row._id)
  }

  const columns = useColumns(
    handleEdit,
    handleDelete,
    handleSave,
    handleCancel,
    (row) => isRowNew[row._id],
    rowModesModel,
  )

  const processRowUpdate = async (newRow, oldRow) => {
    if (!isUpdating) {
      return oldRow
    }
    if (newRow && newRow._id && newRow._id.startsWith('temp-')) {
      const addedProduct = await addProductToContext({
        ...newRow,
        _id: undefined,
      })
      setProducts((currentProducts) =>
        currentProducts.map((row) =>
          row._id === newRow._id ? { ...addedProduct, isNew: false } : row,
        ),
      )
    } else {
      await updateProductInContext(newRow._id, newRow)
      setProducts((currentProducts) =>
        currentProducts.map((row) => (row._id === newRow._id ? newRow : row)),
      )
    }
    return newRow
  }

  const handleProcessRowUpdateError = (error) => {
    console.error('Erreur lors de la mise à jour de la ligne :', error)
  }

  return (
    <DataGridPro
      localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
      rows={filteredProducts}
      columns={columns}
      rowModesModel={rowModesModel}
      onRowModesModelChange={setRowModesModel}
      onRowEditStop={handleRowEditStop}
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
      getRowId={(row) => row._id || row.id || `temp-${Date.now()}`}
      processRowUpdate={processRowUpdate}
      onProcessRowUpdateError={handleProcessRowUpdateError}
      slots={{
        toolbar: CustomToolbar,
      }}
      disableRowSelectionOnClick
      slotProps={{
        toolbar: {
          onAddClick: handleAddClick,
          showQuickFilter: true,
        },
      }}
      style={{ width: '100%' }}
    />
  )
}

export default ProductsGrid
