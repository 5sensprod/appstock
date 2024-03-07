import React, { useState, useCallback } from 'react'
import {
  DataGridPremium,
  frFR,
  GridRowEditStopReasons,
  GridRowModes,
} from '@mui/x-data-grid-premium'
import { Typography } from '@mui/material'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'
import useFilteredProducts from './hooks/useFilteredProducts'
import useColumns from './hooks/useColumns'
import CustomToolbar from './CustomToolbar'
import { useUI } from '../../contexts/UIContext'
import BulkUpdateProduct from '../product/BulkUpdateProduct'
import { useGridPreferences } from '../../contexts/GridPreferenceContext'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import QRCodeGenerator from './QRCodeGenerator'
import { useCategoryContext } from '../../contexts/CategoryContext'
import { useCategoryTreeSelect } from '../../contexts/CategoryTreeSelectContext'

const ProductsGrid = ({ selectedCategoryId }) => {
  const { showToast, showConfirmDialog } = useUI()
  const [open, setOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(null)
  const { currentCategoryId, setCurrentCategoryId } = useCategoryContext()
  const { resetSelectedCategory } = useCategoryTreeSelect()
  const { gridPreferences, updatePreferences } = useGridPreferences()
  const [gridKey, setGridKey] = useState(0)
  const {
    products,
    setProducts,
    addProductToContext,
    updateProductInContext,
    deleteProductFromContext,
    searchTerm,
  } = useProductContextSimplified()

  // État pour le modèle de tri
  const [sortModel, setSortModel] = useState([
    {
      field: 'dateSoumission',
      sort: 'desc',
    },
  ])
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 740,
    height: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    zIndex: 1500,
  }

  const filteredProducts = useFilteredProducts(selectedCategoryId, searchTerm)
  const [isRowNew, setIsRowNew] = useState({})
  const [rowModesModel, setRowModesModel] = useState({})
  const [editingRow, setEditingRow] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedProductIds, setSelectedProductIds] = useState(new Set())
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false)

  const handleSelectionModelChange = (newSelectionModel) => {
    setSelectedProductIds(new Set(newSelectionModel))
  }

  const openBulkUpdateModal = () => {
    if (selectedProductIds.size >= 2) {
      setIsBulkUpdateModalOpen(true)
    } else {
      showToast(
        'Veuillez cocher au moins deux produits pour la modification de masse',
        'error',
      )
    }
  }

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
    resetSelectedCategory()
    setGridKey((prevKey) => prevKey + 1)
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
    // Gère l'abandon de l'ajout d'un nouveau produit
    if (isRowNew[row._id]) {
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product._id !== row._id),
      )
      setIsRowNew((currentIsRowNew) => {
        const newIsRowNew = { ...currentIsRowNew }
        delete newIsRowNew[row._id]
        return newIsRowNew
      })
      // Supprime également la ligne du rowModesModel
      setRowModesModel((oldModel) => {
        const newModel = { ...oldModel }
        delete newModel[row._id]
        return newModel
      })
    }
    // Gère l'abandon de la modification d'un produit existant
    else if (editingRow && editingRow._id === row._id) {
      // Rétablit les valeurs originales de la ligne existante
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product._id === editingRow._id ? editingRow : product,
        ),
      )
      // S'assure que le mode de la ligne est correctement réinitialisé dans rowModesModel
      setRowModesModel((oldModel) => {
        const newModel = { ...oldModel, [row._id]: { mode: GridRowModes.View } }
        return newModel
      })
    }

    // Réinitialise l'état d'édition après l'annulation de l'ajout ou de la modification
    setEditingRow(null)
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

  const handleOpen = (productId) => {
    const selectedProduct = products.find(
      (product) => product._id === productId,
    )

    // Vérifie si le produit sélectionné a un gencode
    if (selectedProduct && selectedProduct.gencode) {
      setSelectedProductId(productId)
      setOpen(true)
    } else {
      showToast('Un gencode est nécessaire pour générer le QR code.', 'error')
    }
  }

  const handleClose = () => setOpen(false)

  const { columns } = useColumns(
    handleEdit,
    handleDelete,
    handleSave,
    handleCancel,
    handleOpen,
    rowModesModel,
  )

  const processRowUpdate = async (newRow, oldRow) => {
    if (!isUpdating) {
      return oldRow
    }

    let updatedRow = { ...newRow }

    // Appliquer l'ID de catégorie courant s'il a été modifié, sinon conserver l'ancienne catégorie
    updatedRow.categorie =
      currentCategoryId !== null ? currentCategoryId : oldRow.categorie

    try {
      if (newRow._id.startsWith('temp-')) {
        // Ajout d'un nouveau produit
        const addedProduct = await addProductToContext({
          ...updatedRow,
          _id: undefined,
        })
        // Mise à jour de la liste des produits avec le produit ajouté
        setProducts((currentProducts) => [
          ...currentProducts,
          { ...addedProduct, isNew: false },
        ])
        showToast('Produit ajouté avec succès', 'success')
      } else {
        // Mise à jour d'un produit existant avec updatedRow qui inclut la catégorie ajustée
        await updateProductInContext(updatedRow._id, updatedRow)
        setProducts((currentProducts) =>
          currentProducts.map((row) =>
            row._id === updatedRow._id ? updatedRow : row,
          ),
        )
        showToast('Produit modifié avec succès', 'success')
      }
      setCurrentCategoryId(null)
      return updatedRow
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error)
      showToast("Erreur lors de l'enregistrement du produit", 'error')
      throw error
    }
  }

  const handleProcessRowUpdateError = (error) => {
    console.error('Erreur lors de la mise à jour de la ligne :', error)
  }
  const handleDensityChange = (newDensity) => {
    updatePreferences({ density: newDensity })
  }

  const handleColumnVisibilityChange = (newModel) => {
    updatePreferences({ columnsVisibility: newModel })
  }

  // Gestionnaire pour les changements de taille de page
  const handlePaginationModelChange = (newModel) => {
    updatePreferences({ paginationModel: newModel })
  }

  const toolbar = useCallback(
    () => (
      <CustomToolbar
        onAddClick={handleAddClick}
        onBulkEditClick={openBulkUpdateModal}
      />
    ),
    [handleAddClick, openBulkUpdateModal],
  )

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {selectedProductId && (
            <QRCodeGenerator productId={selectedProductId} />
          )}
        </Box>
      </Modal>
      {filteredProducts.length === 0 ? (
        <Typography variant="h6">Aucun produit trouvé</Typography>
      ) : (
        <DataGridPremium
          key={gridKey}
          columnVisibilityModel={gridPreferences.columnsVisibility}
          onColumnVisibilityModelChange={handleColumnVisibilityChange}
          onColumnVisibilityChange={handleColumnVisibilityChange}
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
          rows={filteredProducts}
          columns={columns}
          sortModel={sortModel}
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
              paginationModel: gridPreferences.paginationModel,
            },
          }}
          pageSize={gridPreferences.paginationModel.pageSize}
          onPageSizeChange={(newPageSize) => {
            handlePaginationModelChange({
              ...gridPreferences.paginationModel,
              pageSize: newPageSize,
            })
          }}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[10, 25, 50]}
          pagination
          checkboxSelection
          checkboxSelectionVisibleOnly
          getRowId={(row) => row._id || row.id || `temp-${Date.now()}`}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          searchTerm={searchTerm}
          slots={{
            toolbar: toolbar,
          }}
          disableRowSelectionOnClick
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          style={{ width: 'fit-content' }}
        />
      )}
      {isBulkUpdateModalOpen && (
        <BulkUpdateProduct
          selectedProductIds={selectedProductIds}
          onClose={() => setIsBulkUpdateModalOpen(false)}
        />
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {selectedProductId && (
            <QRCodeGenerator productId={selectedProductId} />
          )}
        </Box>
      </Modal>
    </>
  )
}

export default ProductsGrid
