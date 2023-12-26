// src/components/PRODUCTS/ProductsGrid.js
import React from 'react'
import { DataGridPro, frFR, GridToolbar } from '@mui/x-data-grid-pro'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'
import { useCategoryContext } from '../../contexts/CategoryContext'
import { formatNumberFrench } from '../../utils/priceUtils'
import moment from 'moment'

const ProductsGrid = ({ selectedCategoryId }) => {
  const { products, updateProductInContext } = useProductContextSimplified()
  const { categories } = useCategoryContext()

  // Filtrer les produits en fonction du searchTerm
  const filteredProducts = products.filter((product) => {
    // Filtrage par catégorie
    const matchesCategory = selectedCategoryId
      ? product.categorie === selectedCategoryId
      : true

    return matchesCategory
  })

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
      valueGetter: (params) => {
        const category = categories.find((cat) => cat._id === params.value)
        return category ? category.name : 'Non classifié'
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
    // Ajoutez d'autres colonnes selon les besoins
  ]

  const processRowUpdate = async (newRow, oldRow) => {
    try {
      // Appel à la fonction du contexte pour mettre à jour le produit sur le serveur
      await updateProductInContext(newRow._id, newRow)
      return newRow
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error)
      throw error // Important pour déclencher onProcessRowUpdateError
    }
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
        toolbar: GridToolbar,
      }}
      disableRowSelectionOnClick
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
      }}
      style={{ width: '100%' }}
    />
  )
}

export default ProductsGrid