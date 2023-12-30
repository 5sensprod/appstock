import React, { useState } from 'react'
import { useCategoryContext } from '../../../contexts/CategoryContext'
import { formatNumberFrench } from '../../../utils/priceUtils'
import moment from 'moment'
import CategorySelect from '../../CATEGORIES/CategorySelect'
import { useProductContextSimplified } from '../../../contexts/ProductContextSimplified'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import { GridRowModes, GridActionsCellItem } from '@mui/x-data-grid-pro'

const useColumns = (
  rowModesModel,
  setRowModesModel,
  setRows,
  addProduct,
  updateProduct,
) => {
  const { categories } = useCategoryContext()
  const { deleteProduct } = useProductContextSimplified()
  const [editRowsModel, setEditRowsModel] = useState({})

  const handleEditClick = (id) => {
    setEditingRow(rows.find((row) => row.id === id))
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.Edit },
    }))
  }
  const handleSaveClick = async (id, row) => {
    try {
      let response
      if (row.isNew || id.startsWith('new-')) {
        console.log('Données de la nouvelle ligne:', row)
        response = await addProduct(row)
      } else {
        response = await updateProduct(id, row)
      }

      if (response && response.data) {
        const updatedProduct = response.data
        setRows((prevRows) =>
          prevRows.map((r) => (r.id === id ? updatedProduct : r)),
        )
      }

      setRowModesModel((prev) => ({
        ...prev,
        [id]: { mode: GridRowModes.View },
      }))
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du produit:', error)
    }
  }

  const handleCancelClick = (id) => {
    if (id.startsWith('new-')) {
      setRows((prev) => prev.filter((row) => row.id !== id))
    } else {
      setRowModesModel((prev) => ({
        ...prev,
        [id]: { mode: GridRowModes.View },
      }))
    }
  }

  const handleDeleteClick = (id) => {
    // Implémentez la logique de suppression ici
    setRows((prev) => prev.filter((row) => row.id !== id))
  }

  const actionColumn = {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 100,
    getActions: (params) => {
      const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit

      if (isInEditMode) {
        return [
          <GridActionsCellItem
            icon={<SaveIcon />}
            label="Save"
            onClick={() => handleSaveClick(params.id, params.row)}
          />,
          <GridActionsCellItem
            icon={<CancelIcon />}
            label="Cancel"
            onClick={() => handleCancelClick(params.id)}
          />,
        ]
      } else {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => {
              /* logique d'édition */
            }}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => deleteProduct(params.id)}
          />,
        ]
      }
    },
  }

  const getCategoryPath = (categoryId) => {
    let path = []
    let currentCategory = categories.find((cat) => cat._id === categoryId)

    while (currentCategory) {
      path.unshift(currentCategory.name)
      currentCategory = categories.find(
        (cat) => cat._id === currentCategory.parentId,
      )
    }

    return path.join(' > ')
  }

  const columns = [
    {
      field: 'reference',
      headerName: 'Référence',
      flex: 1,
      editable: true,
    },
    {
      field: 'prixVente',
      headerName: 'Px Vente',
      type: 'number',
      flex: 0.5,
      editable: true,
      renderCell: (params) => (
        <span>
          {params.value !== undefined
            ? `${formatNumberFrench(params.value)} €`
            : ''}
        </span>
      ),
    },
    {
      field: 'prixAchat',
      headerName: 'Px Achat',
      type: 'number',
      flex: 0.5,
      editable: true,
      renderCell: (params) => (
        <span>
          {params.value !== undefined
            ? `${formatNumberFrench(params.value)} €`
            : ''}
        </span>
      ),
    },
    {
      field: 'stock',
      headerName: 'Stock',
      type: 'number',
      flex: 0.5,
      editable: true,
    },
    {
      field: 'categorie',
      headerName: 'Catégorie',
      flex: 0.75,
      editable: true,
      valueGetter: (params) => getCategoryPath(params.value) || 'Non classifié',
      renderEditCell: (params) => {
        const currentCategoryName = params.api.getCellValue(
          params.id,
          'categorie',
        )

        return (
          <CategorySelect
            value={currentCategoryName}
            onChange={(newValue) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'categorie',
                value: newValue,
              })
            }}
          />
        )
      },
    },
    { field: 'marque', headerName: 'Marque', flex: 0.75 },
    { field: 'gencode', headerName: 'GenCode', flex: 0.75 },
    {
      field: 'dateSoumission',
      headerName: 'Date Ajout',
      type: 'date',
      flex: 0.5,
      valueGetter: (params) =>
        moment(params.value).isValid() ? moment(params.value).toDate() : null,
    },
    { field: 'tva', headerName: 'TVA', type: 'number', flex: 0.5 },
    actionColumn,
  ]

  return { columns, editRowsModel }
}

export default useColumns
