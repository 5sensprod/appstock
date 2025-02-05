import React, { useMemo } from 'react'
import moment from 'moment'
import { useCategoryContext } from '../../../contexts/CategoryContext'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton } from '@mui/material'
import { Box } from '@mui/material'

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

  const priceFormatter = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const columns = useMemo(
    () => [
      {
        field: 'actions',
        headerName: 'Actions',
        width: 130,
        renderCell: (params) => {
          if (params.aggregation) {
            return null
          }
          return (
            <>
              {renderEditButton(params)}
              {renderDeleteButton(params)}
            </>
          )
        },
        sortable: false,
        disableColumnMenu: true,
      },
      {
        field: 'reference',
        headerName: 'Référence',
        width: 200,
        aggregable: false,
      },
      {
        field: 'designation',
        headerName: 'Désignation',
        width: 200,
        availableAggregationFunctions: ['size'],
      },
      {
        field: 'prixAchat',
        headerName: 'P.A HT',
        width: 80,
        type: 'number',
        valueFormatter: (params) => {
          if (!params.value) return ''
          return priceFormatter.format(params.value)
        },
        availableAggregationFunctions: ['min', 'max', 'sum', 'avg'],
      },
      {
        field: 'marge',
        headerName: 'Marge (%)',
        width: 80,
        type: 'number',
        valueFormatter: (params) => {
          if (!params.value) return ''
          return priceFormatter.format(params.value)
        },
        availableAggregationFunctions: ['avg'],
      },
      {
        field: 'prixVente',
        headerName: 'P.V TTC',
        width: 80,
        type: 'number',
        valueFormatter: (params) => {
          if (!params.value) return ''
          return priceFormatter.format(params.value)
        },
        availableAggregationFunctions: ['min', 'max', 'sum', 'avg'],
      },
      {
        field: 'stock',
        headerName: 'Stock',
        width: 90,
        type: 'number',
        availableAggregationFunctions: ['min', 'max', 'sum'],
      },
      {
        field: 'categorie',
        headerName: 'Catégorie',
        width: 200,
        renderCell: (params) => getCategoryPath(params.value) || '',
        aggregable: false,
      },
      {
        field: 'supplierId',
        headerName: 'Fournisseur',
        width: 150,
        renderCell: (params) => {
          const supplier = suppliers.find((sup) => sup._id === params.value)
          return supplier ? supplier.name : ''
        },
        // Fonction pour filtrer par nom de fournisseur lors de la recherche rapide
        getApplyQuickFilterFn: (filterValue) => {
          return (params) => {
            const supplier = suppliers.find((sup) => sup._id === params.value)
            return supplier
              ? supplier.name.toLowerCase().includes(filterValue.toLowerCase())
              : false
          }
        },
        aggregable: false,
      },
      { field: 'marque', headerName: 'Marque', width: 150, aggregable: false },
      {
        field: 'gencode',
        headerName: 'Gencode',
        width: 150,
        aggregable: false,
      },
      {
        field: 'tva',
        headerName: 'TVA',
        width: 70,
        type: 'number',
        aggregable: false,
      },
      {
        field: 'dateSoumission',
        headerName: 'Date Ajout',
        width: 100,
        type: 'date',
        valueGetter: (params) =>
          params.value ? moment(params.value).toDate() : null,
        aggregable: false,
      },
    ],
    [getCategoryPath, suppliers, handleOpenModal, handleDeleteProduct],
  )

  return columns
}

export default useProductManagerColumns
