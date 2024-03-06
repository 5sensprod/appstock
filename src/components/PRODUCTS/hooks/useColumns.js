import React from 'react'
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
import { formatNumberWithComma } from '../../../utils/formatUtils'

const useColumns = (
  handleEdit,
  handleDelete,
  handleSave,
  handleCancel,
  handleOpen,
  rowModesModel,
) => {
  const { categories } = useCategoryContext()

  const getCategoryPathAndId = (categoryId) => {
    let path = []
    let currentCategory = categories.find((cat) => cat._id === categoryId)

    while (currentCategory) {
      path.unshift(currentCategory.name)
      if (!currentCategory.parentId) {
        // Si on est au niveau le plus haut, on garde cet ID comme référence
        return { path: path.join(' > '), categoryId: currentCategory._id }
      }
      currentCategory = categories.find(
        (cat) => cat._id === currentCategory.parentId,
      )
    }

    return { path: 'Non catégorisé', categoryId: null } // ou une valeur par défaut appropriée
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
      width: 300,
      // flex: 1,
      editable: true,
      aggregable: false,
      groupable: false,
    },
    {
      field: 'prixVente',
      headerName: 'P.V',
      type: 'number',
      width: 80,
      // flex: 0.5,
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
      headerName: 'P.A',
      type: 'number',
      width: 80,
      // flex: 0.5,
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
      width: 70,
      // flex: 0.5,
      editable: true,
      groupable: false,
      headerAlign: 'left',
      align: 'left',
      availableAggregationFunctions: ['sum', 'max', 'min'],
    },
    {
      field: 'categorie',
      headerName: 'Catégorie',
      width: 150,
      editable: true,
      aggregable: false,
      valueGetter: (params) => {
        const categoryInfo = getCategoryPathAndId(params.row.categorie)
        return categoryInfo ? categoryInfo.path : ''
      },
      renderEditCell: (params) => {
        const currentCategoryId = params.row.categorie
        return (
          <CategorySelect
            value={currentCategoryId}
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
      width: 150,
      // flex: 0.75,
      editable: true,
      aggregable: false,
    },
    {
      field: 'gencode',
      headerName: 'GenCode',
      width: 150,
      // flex: 0.75,
      editable: true,
      disableColumnMenu: true,
      sortable: true,
      sortable: false,
    },
    {
      field: 'tva',
      headerName: 'TVA',
      type: 'number',
      width: 50,
      // flex: 0.5,
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
        return `${formatNumberWithComma(params.value)}`
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
      width: 120,
      // flex: 0.75,
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

  return { columns, getCategoryPathAndId }
}

export default useColumns
