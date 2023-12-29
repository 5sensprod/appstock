import React, { useState } from 'react'
import { useCategoryContext } from '../../../contexts/CategoryContext'
import { formatNumberFrench } from '../../../utils/priceUtils'
import moment from 'moment'
import CategorySelect from '../../CATEGORIES/CategorySelect'
import { useProductContextSimplified } from '../../../contexts/ProductContextSimplified'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'

const useColumns = () => {
  const { categories } = useCategoryContext()
  const { deleteProduct } = useProductContextSimplified()
  const [editRowsModel, setEditRowsModel] = useState({})

  const handleEditClick = (id) => {
    // Activer le mode d'édition pour la ligne spécifiée
    const isEditable = editRowsModel[id]?.isEditable
    setEditRowsModel({ ...editRowsModel, [id]: { isEditable: !isEditable } })
  }

  const actionColumn = {
    field: 'actions',
    headerName: 'Actions',
    flex: 0.5,
    sortable: false,
    renderCell: (params) => (
      <>
        <EditIcon
          onClick={() => handleEditClick(params.row._id)}
          style={{ cursor: 'pointer', marginRight: 8 }}
        />
        <DeleteIcon
          onClick={() => deleteProduct(params.row._id)}
          style={{ cursor: 'pointer' }}
        />
      </>
    ),
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
    { field: 'reference', headerName: 'Référence', flex: 1, editable: true },
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
