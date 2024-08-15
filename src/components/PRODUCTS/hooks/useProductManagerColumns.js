import { useMemo } from 'react'
import moment from 'moment'
import { useCategoryContext } from '../../../contexts/CategoryContext'

const useProductManagerColumns = ({ suppliers }) => {
  const { getCategoryPath } = useCategoryContext() // Récupère getCategoryPath depuis le contexte

  const columns = useMemo(
    () => [
      { field: 'reference', headerName: 'Référence', width: 200 },
      { field: 'marque', headerName: 'Marque', width: 150 },
      {
        field: 'prixAchat',
        headerName: "Prix d'Achat",
        width: 150,
        type: 'number',
      },
      {
        field: 'prixVente',
        headerName: 'Prix de Vente',
        width: 150,
        type: 'number',
      },
      { field: 'stock', headerName: 'Stock', width: 150, type: 'number' },
      {
        field: 'categorie',
        headerName: 'Catégorie',
        width: 200,
        renderCell: (params) => {
          return getCategoryPath(params.value) || 'Inconnu'
        },
      },
      { field: 'gencode', headerName: 'Gencode', width: 150 },
      {
        field: 'supplierId',
        headerName: 'Fournisseur',
        width: 200,
        renderCell: (params) => {
          const supplier = suppliers.find((sup) => sup._id === params.value)
          return supplier ? supplier.name : 'Inconnu'
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
      { field: 'tva', headerName: 'TVA', width: 100, type: 'number' },
      {
        field: 'dateSoumission',
        headerName: 'Date Ajout',
        width: 150,
        type: 'date',
        valueGetter: (params) =>
          params.value ? moment(params.value).toDate() : null,
      },
    ],
    [getCategoryPath, suppliers],
  )

  return columns
}

export default useProductManagerColumns
