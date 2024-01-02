import React, { useState } from 'react'
import { DataGridPro, frFR } from '@mui/x-data-grid-pro'
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

  const handleAddClick = () => {
    const tempId = Date.now().toString() // Définir tempId ici
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
      // ... autres champs
    }

    setIsRowNew({ ...isRowNew, [tempId]: true })
    setProducts([...products, newProduct])
  }

  const handleEdit = (row) => {
    // Logique pour commencer l'édition d'une ligne
  }

  const handleDelete = async (row) => {
    // Logique pour supprimer une ligne
    await deleteProductFromContext(row._id)
    setProducts((currentProducts) =>
      currentProducts.filter((p) => p._id !== row._id),
    )
  }

  const handleSave = async (row) => {
    if (!row) {
      console.error('Erreur : la ligne à sauvegarder est undefined.')
      return
    }

    if (isRowNew[row._id]) {
      // Logique pour ajouter un nouveau produit
      try {
        const addedProduct = await addProductToContext({
          ...row,
          _id: undefined, // Retirer l'_id_ temporaire avant d'envoyer à l'API
        })
        setIsRowNew((currentIsRowNew) => {
          const newIsRowNew = { ...currentIsRowNew }
          delete newIsRowNew[row._id]
          return newIsRowNew
        })
        setProducts((currentProducts) => [
          ...currentProducts.filter((p) => p._id !== row._id),
          addedProduct,
        ])
      } catch (error) {
        console.error("Erreur lors de l'ajout du produit:", error)
      }
    } else {
      // Logique pour mettre à jour un produit existant
      await updateProductInContext(row._id, row)
      setProducts((currentProducts) =>
        currentProducts.map((p) => (p._id === row._id ? row : p)),
      )
    }
  }

  const handleCancel = (row) => {
    // Supprime la nouvelle ligne si l'ajout est annulé
    if (isRowNew[row._id]) {
      setProducts((currentProducts) =>
        currentProducts.filter((p) => p._id !== row._id),
      )
      setIsRowNew((currentIsRowNew) => {
        const newIsRowNew = { ...currentIsRowNew }
        delete newIsRowNew[row._id]
        return newIsRowNew
      })
    }
  }

  const columns = useColumns(
    handleEdit,
    handleDelete,
    handleSave,
    handleCancel,
    (row) => isRowNew[row._id],
  )

  const processRowUpdate = async (newRow, oldRow) => {
    console.log('processRowUpdate - newRow:', newRow, 'oldRow:', oldRow)
    if (!newRow._id || newRow._id.startsWith('temp-')) {
      try {
        console.log('Nouveau produit:', newRow)
        const addedProduct = await addProductToContext({
          ...newRow,
          _id: undefined,
        })
        setProducts((currentProducts) => [
          ...currentProducts.filter((p) => p._id !== 'temp-id'),
          addedProduct,
        ])
      } catch (error) {
        console.error("Erreur lors de l'ajout du produit:", error)
      }
    } else {
      try {
        await updateProductInContext(newRow._id, newRow)
        setProducts((currentProducts) =>
          currentProducts.map((p) => (p._id === newRow._id ? newRow : p)),
        )
      } catch (error) {
        console.error('Erreur lors de la mise à jour du produit:', error)
      }
    }
    return newRow
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
          onAddClick: handleAddClick,
          showQuickFilter: true,
        },
      }}
      style={{ width: '100%' }}
    />
  )
}

export default ProductsGrid
