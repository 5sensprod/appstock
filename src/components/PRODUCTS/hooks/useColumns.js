import React, { useState } from 'react'
import { useCategoryContext } from '../../../contexts/CategoryContext'
import { formatNumberFrench } from '../../../utils/priceUtils'
import moment from 'moment'
import CategorySelect from '../../CATEGORIES/CategorySelect'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'
import QrCodeIcon from '@mui/icons-material/QrCode'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  GridRowModes,
  GRID_AGGREGATION_ROOT_FOOTER_ROW_ID,
} from '@mui/x-data-grid-premium'
import CustomSelect from '../../ui/CustomSelect'
import { TVA_RATES } from '../../../utils/constants'

const useColumns = (
  handleEdit,
  handleDelete,
  handleSave,
  handleCancel,
  handleOpen,
  rowModesModel,
) => {
  const { categories } = useCategoryContext()

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

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

  const isNewRowFunction = (row) => {
    // Déterminez si la ligne est nouvelle. Par exemple, une ligne sans ID est considérée comme nouvelle.
    return !row._id
  }

  const columns = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => {
        if (params.id === GRID_AGGREGATION_ROOT_FOOTER_ROW_ID) {
          return null
        }
        const isNew = isNewRowFunction(params.row)
        const isInEditMode =
          rowModesModel[params.id]?.mode === GridRowModes.Edit

        return (
          <div>
            {isNew || isInEditMode ? (
              <>
                <IconButton onClick={() => handleSave(params.row)}>
                  <SaveIcon />
                </IconButton>
                <IconButton onClick={() => handleCancel(params.row)}>
                  <CancelIcon />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton onClick={() => handleEdit(params.row)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(params.row)}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}
            <IconButton onClick={() => handleOpen(params.id)}>
              <QrCodeIcon />
            </IconButton>
          </div>
        )
      },
      editable: false,
      disableColumnMenu: true,
      sortable: false,
      hideable: false,
    },
    {
      field: 'reference',
      headerName: 'Référence',
      flex: 1,
      editable: true,
      aggregable: false,
      groupable: false,
    },
    {
      field: 'prixVente',
      headerName: 'Px Vente',
      type: 'number',
      flex: 0.5,
      editable: true,
      groupable: false,
      align: 'right',
      headerAlign: 'left',
      align: 'left',
      availableAggregationFunctions: ['sum', 'max', 'avg', 'min'],
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
      groupable: false,
      headerAlign: 'left',
      align: 'left',
      availableAggregationFunctions: ['sum', 'max', 'avg', 'min'],
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
      groupable: false,
      headerAlign: 'left',
      align: 'left',
      availableAggregationFunctions: ['sum', 'max', 'min'],
    },
    {
      field: 'categorie',
      headerName: 'Catégorie',
      flex: 0.75,
      editable: true,
      aggregable: false,
      valueGetter: (params) => {
        if (params.id === GRID_AGGREGATION_ROOT_FOOTER_ROW_ID) {
          return '' // Ne rien afficher pour les lignes d'agrégation
        }
        return getCategoryPath(params.value) || 'Non catégorisé'
      },
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
    {
      field: 'marque',
      headerName: 'Marque',
      flex: 0.75,
      editable: true,
      aggregable: false,
    },
    {
      field: 'gencode',
      headerName: 'GenCode',
      flex: 0.75,
      editable: true,
      disableColumnMenu: true,
      sortable: true,
      sortable: false,
    },
    {
      field: 'tva',
      headerName: 'TVA',
      type: 'number',
      flex: 0.5,
      editable: true,
      aggregable: false,
      disableColumnMenu: true,
      sortable: false,
      headerAlign: 'left',
      align: 'left',
      valueFormatter: (params) => {
        if (params.id === GRID_AGGREGATION_ROOT_FOOTER_ROW_ID) {
          return '' // Ne rien afficher pour les lignes d'agrégation
        }
        return `${params.value}%` // Ajouter un symbole de pourcentage à la valeur
      },
      renderEditCell: (params) => (
        <CustomSelect
          label="TVA"
          options={TVA_RATES}
          value={params.value}
          onChange={(e) =>
            params.api.setEditCellValue(
              { id: params.id, field: 'tva', value: e.target.value },
              e,
            )
          }
          showLabel={false}
        />
      ),
    },
    {
      field: 'dateSoumission',
      headerName: 'Date Ajout',
      type: 'date',
      flex: 0.75,
      aggregable: false,
      hideable: true,
      valueGetter: (params) => {
        if (params.id === GRID_AGGREGATION_ROOT_FOOTER_ROW_ID) {
          return null // Ne rien afficher pour les lignes d'agrégation
        }
        return moment(params.value).isValid()
          ? moment(params.value).toDate()
          : null
      },
    },
  ]

  return { columns }
}

export default useColumns
