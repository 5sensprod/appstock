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

const ProductsGrid = ({ selectedCategoryId }) => {
  const { showToast, showConfirmDialog } = useUI()
  const [open, setOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(null)

  const { gridPreferences, updatePreferences } = useGridPreferences()

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
    width: 740, // Augmentée à 600px pour plus de largeur
    height: 500, // Définir une hauteur spécifique si nécessaire
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4, // Padding autour du contenu de la modal
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
    if (selectedProductIds.size > 0) {
      setIsBulkUpdateModalOpen(true)
    } else {
      // Afficher un message d'erreur ou une notification si aucun produit n'est sélectionné
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

  // Fonction pour ouvrir la modal avec le produit sélectionné
  const handleOpen = (productId) => {
    setSelectedProductId(productId)
    setOpen(true)
  }

  // Fonction pour fermer la modal
  const handleClose = () => setOpen(false)

  const { columns } = useColumns(
    handleEdit,
    handleDelete,
    handleSave,
    handleCancel,
    handleOpen, // Cette fonction est maintenant passée directement
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
    // Mettez à jour les préférences de la grille
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
    [handleAddClick, openBulkUpdateModal], // Les dépendances
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
              paginationModel: gridPreferences.paginationModel, // Utilisez l'état du contexte
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
          style={{ width: '100%' }}
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
