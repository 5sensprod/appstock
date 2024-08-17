import React, { useMemo } from 'react'
import moment from 'moment'
import { useCategoryContext } from '../../../contexts/CategoryContext'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton } from '@mui/material'

const useProductManagerColumns = ({
  suppliers,
  handleOpenModal,
  handleDeleteProduct,
}) => {
  const { getCategoryPath } = useCategoryContext()

  // Fonction pour rendre le bouton d'édition
  const renderEditButton = (params) => (
    <IconButton onClick={() => handleOpenModal(params.row)}>
      <EditIcon />
    </IconButton>
  )

  // Fonction pour rendre le bouton de suppression
  const renderDeleteButton = (params) => (
    <IconButton onClick={() => handleDeleteProduct(params.row._id)}>
      <DeleteIcon />
    </IconButton>
  )

  const columns = useMemo(
    () => [
      {
        field: 'actions',
        headerName: 'Actions',
        width: 130,
        renderCell: (params) => (
          <>
            {renderEditButton(params)}
            {renderDeleteButton(params)}
          </>
        ),
        sortable: false,
        filterable: false,
      },
      { field: 'reference', headerName: 'Référence', width: 200 },
      {
        field: 'prixAchat',
        headerName: 'Px Achat',
        width: '80',
        type: 'number',
      },
      { field: 'prixVente', headerName: 'Px Vente', width: 80, type: 'number' },
      { field: 'stock', headerName: 'Stock', width: 90, type: 'number' },
      {
        field: 'categorie',
        headerName: 'Catégorie',
        width: 200,
        renderCell: (params) => getCategoryPath(params.value) || '',
      },
      {
        field: 'supplierId',
        headerName: 'Fournisseur',
        width: 100,
        renderCell: (params) => {
          const supplier = suppliers.find((sup) => sup._id === params.value)
          return supplier ? supplier.name : ''
        },
      },
      { field: 'marque', headerName: 'Marque', width: 150 },
      { field: 'gencode', headerName: 'Gencode', width: 150 },
      { field: 'tva', headerName: 'TVA', width: 70, type: 'number' },
      {
        field: 'dateSoumission',
        headerName: 'Date Ajout',
        width: 100,
        type: 'date',
        valueGetter: (params) =>
          params.value ? moment(params.value).toDate() : null,
      },
    ],
    [getCategoryPath, suppliers, handleOpenModal, handleDeleteProduct],
  )

  return columns
}

export default useProductManagerColumns
