import React, { useMemo } from 'react' // Ajout de l'import de React
import moment from 'moment'
import { useCategoryContext } from '../../../contexts/CategoryContext'
import EditIcon from '@mui/icons-material/Edit'
import { IconButton } from '@mui/material'

const useProductManagerColumns = ({ suppliers, handleOpenModal }) => {
  const { getCategoryPath } = useCategoryContext()

  // Fonction pour rendre le bouton d'édition
  const renderEditButton = (params) => (
    <IconButton onClick={() => handleOpenModal(params.row)}>
      <EditIcon />
    </IconButton>
  )

  const columns = useMemo(
    () => [
      {
        field: 'edit',
        headerName: 'Modifier',
        width: 100,
        renderCell: renderEditButton,
        sortable: false, // Le rendre non triable pour l'action
        filterable: false, // Désactiver les filtres pour la colonne action
      },
      { field: 'reference', headerName: 'Référence', width: 200 },
      {
        field: 'prixAchat',
        headerName: 'Px Achat',
        width: '80',
        type: 'number',
      },
      {
        field: 'prixVente',
        headerName: 'Px Vente',
        width: 80,
        type: 'number',
      },
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
        getApplyQuickFilterFn: (filterValue) => {
          return (params) => {
            const supplier = suppliers.find((sup) => sup._id === params.value)
            return supplier
              ? supplier.name.toLowerCase().includes(filterValue.toLowerCase())
              : false
          }
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
    [getCategoryPath, suppliers, handleOpenModal], // handleOpenModal doit être passé comme dépendance
  )

  return columns
}

export default useProductManagerColumns
