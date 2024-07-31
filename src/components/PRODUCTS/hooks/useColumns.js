import React from 'react'
import { useCategoryContext } from '../../../contexts/CategoryContext'
import { useSuppliers } from '../../../contexts/SupplierContext'
import { formatNumberFrench } from '../../../utils/priceUtils'
import moment from 'moment'
import CategorySelect from '../../CATEGORIES/CategorySelect'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import { IconButton, MenuItem, Select } from '@mui/material'
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
  suppliers, // Utilisation des fournisseurs
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
      editable: true,
      aggregable: false,
      groupable: false,
    },
    {
      field: 'prixVente',
      headerName: 'P.V',
      type: 'number',
      width: 80,
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
      field: 'supplierId',
      headerName: 'Fournisseur',
      width: 200,
      editable: true,
      renderCell: (params) => {
        const supplier = suppliers.find((s) => s._id === params.value)
        return supplier ? supplier.name : ''
      },
      renderEditCell: (params) => (
        <Select
          value={params.value || ''}
          onChange={(event) => {
            params.api.setEditCellValue({
              id: params.id,
              field: 'supplierId',
              value: event.target.value,
            })
            params.api.setEditCellValue({
              id: params.id,
              field: 'marque',
              value: '',
            })
          }}
          fullWidth
        >
          {suppliers.map((supplier) => (
            <MenuItem key={supplier._id} value={supplier._id}>
              {supplier.name}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: 'marque',
      headerName: 'Marque',
      width: 150,
      editable: true,
      aggregable: false,
      renderEditCell: (params) => {
        const supplierId = params.row.supplierId || params.value
        const selectedSupplier = suppliers.find(
          (supplier) => supplier._id === supplierId,
        )
        const brands = selectedSupplier ? selectedSupplier.brands : []

        return (
          <Select
            value={
              params.value && brands.includes(params.value) ? params.value : ''
            }
            onChange={(event) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'marque',
                value: event.target.value,
              })
            }}
            fullWidth
          >
            {brands.map((brand, index) => (
              <MenuItem key={index} value={brand}>
                {brand}
              </MenuItem>
            ))}
          </Select>
        )
      },
    },
    {
      field: 'gencode',
      headerName: 'GenCode',
      width: 150,
      editable: true,
      disableColumnMenu: true,
      sortable: true,
      sortable: false,
    },
    {
      field: 'tva',
      headerName: 'TVA',
      type: 'number',
      width: 90,
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
