// src/components/PRODUCTS/ProductsGrid.js
import React from 'react'
import { DataGridPro, frFR, GridToolbar } from '@mui/x-data-grid-pro'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'
import { useCategoryContext } from '../../contexts/CategoryContext'
import { formatNumberFrench } from '../../utils/priceUtils'
import moment from 'moment'
import CategorySelect from '../CATEGORIES/CategorySelect'

const ProductsGrid = ({ selectedCategoryId }) => {
  const { products, updateProductInContext } = useProductContextSimplified()
  const { categories } = useCategoryContext()

  const findAllSubCategoryIds = (categoryId) => {
    const subCategoryIds = [categoryId]

    const findSubIds = (id) => {
      categories.forEach((cat) => {
        if (cat.parentId === id) {
          subCategoryIds.push(cat._id)
          findSubIds(cat._id)
        }
      })
    }

    findSubIds(categoryId)
    return subCategoryIds
  }

  // Filtrer les produits en fonction du searchTerm
  const filteredProducts = products.filter((product) => {
    if (!selectedCategoryId) {
      // Si aucune catégorie n'est sélectionnée, afficher tous les produits
      return true
    } else {
      // Récupérer les ID de toutes les sous-catégories de la catégorie sélectionnée
      const subCategoryIds = findAllSubCategoryIds(selectedCategoryId)
      // Vérifier si la catégorie du produit correspond à la catégorie sélectionnée ou à une de ses sous-catégories
      return subCategoryIds.includes(product.categorie)
    }
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
      editable: true,
      valueGetter: (params) => {
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

        return getCategoryPath(params.value) || 'Non classifié'
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
