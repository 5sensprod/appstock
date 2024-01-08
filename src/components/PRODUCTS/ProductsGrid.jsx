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
import { useUI } from '../../contexts/UIContext'
import BulkUpdateProduct from '../product/BulkUpdateProduct'
import { useGridPreferences } from '../../contexts/GridPreferenceContext'

const ProductsGrid = ({ selectedCategoryId }) => {
  const { showToast, showConfirmDialog } = useUI()

  const { gridPreferences, updatePreferences } = useGridPreferences()

  const {
    products,
    setProducts,
    addProductToContext,
    updateProductInContext,
    deleteProductFromContext,
  } = useProductContextSimplified()

  // État pour le modèle de tri
  const [sortModel, setSortModel] = useState([
    {
      field: 'dateSoumission',
      sort: 'desc',
    },
  ])

  const filteredProducts = useFilteredProducts(selectedCategoryId)
  const [isRowNew, setIsRowNew] = useState({})
  const [rowModesModel, setRowModesModel] = useState({})
  const [editingRow, setEditingRow] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedProductIds, setSelectedProductIds] = useState(new Set())
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false)

  const handleSelectionModelChange = (newSelectionModel) => {
    console.log('Produits sélectionnés:', newSelectionModel) // Pour le débogage
    setSelectedProductIds(new Set(newSelectionModel))
  }

  const openBulkUpdateModal = () => {
    if (selectedProductIds.size > 0) {
      setIsBulkUpdateModalOpen(true)
    } else {
      // Afficher un message d'erreur ou une notification si aucun produit n'est sélectionné
    }
  }

  // Ajoutez un bouton ou un autre déclencheur pour appeler openBulkEditModal

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
      tva: 20,
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
      showToast("Erreur lors de l'enregistrement du produit", 'error')
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
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product._id === editingRow._id ? editingRow : product,
        ),
      )
    }

    // Nettoyer l'état de l'édition et sortir du mode d'édition
    setEditingRow(null)
    setRowModesModel((oldModel) => {
      return { ...oldModel, [row._id]: { mode: GridRowModes.View } }
    })
  }

  const handleDelete = async (row) => {
    showConfirmDialog(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer ce produit ?',
      async () => {
        await deleteProductFromContext(row._id)
        showToast('Produit supprimé avec succès', 'success')
      },
    )
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

    try {
      if (newRow && newRow._id && newRow._id.startsWith('temp-')) {
        // Logique pour l'ajout d'un nouveau produit
        const addedProduct = await addProductToContext({
          ...newRow,
          _id: undefined,
        })
        setProducts((currentProducts) =>
          currentProducts.map((row) =>
            row._id === newRow._id ? { ...addedProduct, isNew: false } : row,
          ),
        )
        showToast('Produit ajouté avec succès', 'success')
      } else {
        // Logique pour la mise à jour d'un produit existant
        await updateProductInContext(newRow._id, newRow)
        setProducts((currentProducts) =>
          currentProducts.map((row) => (row._id === newRow._id ? newRow : row)),
        )
        showToast('Produit modifié avec succès', 'success')
      }
      return newRow
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la ligne :', error)
      showToast("Erreur lors de l'enregistrement du produit", 'error')
      return oldRow
    }
  }

  const handleProcessRowUpdateError = (error) => {
    console.error('Erreur lors de la mise à jour de la ligne :', error)
  }
  const handleDensityChange = (newDensity) => {
    // Affichez le changement de densité dans la console
    console.log('Densité modifiée :', newDensity)

    // Mettez à jour les préférences de la grille
    updatePreferences({ density: newDensity })
  }

  const handleColumnVisibilityChange = (newModel) => {
    console.log('Modèle de visibilité des colonnes modifié:', newModel)
    updatePreferences({ columnsVisibility: newModel })
  }

  return (
    <>
      <DataGridPro
        columnVisibilityModel={gridPreferences.columnsVisibility}
        onColumnVisibilityModelChange={handleColumnVisibilityChange}
        onColumnVisibilityChange={handleColumnVisibilityChange}
        localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
        rows={filteredProducts}
        columns={columns}
        sortModel={sortModel}
        // selectionModel={Array.from(selectedProductIds)}
        onRowSelectionModelChange={handleSelectionModelChange}
        onSortModelChange={setSortModel}
        rowModesModel={rowModesModel}
        density={gridPreferences.density}
        onDensityChange={(params) => handleDensityChange(params.value)}
        onRowModesModelChange={setRowModesModel}
        onRowEditStop={handleRowEditStop}
        onCellDoubleClick={(params, event) => {
          event.defaultMuiPrevented = true
        }}
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
          toolbar: () => (
            <CustomToolbar
              onAddClick={handleAddClick}
              onBulkEditClick={openBulkUpdateModal}
            />
          ),
        }}
        disableRowSelectionOnClick
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        style={{ width: '100%' }}
      />
      {isBulkUpdateModalOpen && (
        <BulkUpdateProduct
          selectedProductIds={selectedProductIds}
          onClose={() => setIsBulkUpdateModalOpen(false)}
        />
      )}
    </>
  )
}

export default ProductsGrid
