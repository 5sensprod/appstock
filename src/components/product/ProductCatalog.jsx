import React from 'react'
import { DataGrid, frFR, GridActionsCellItem } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { format } from 'date-fns'
import { capitalizeFirstLetter } from '../../utils/formatUtils'

const ProductCatalog = ({
  products,
  onSelectionChange,
  redirectToEdit,
  promptDelete,
  categories,
}) => {
  const categoryMap = categories.reduce((acc, category) => {
    acc[category._id] = category.name
    return acc
  }, {})

  const displayProducts = products.map((product) => ({
    ...product,
    id: product._id,
    categorie: categoryMap[product.categorie] || product.categorie,
    sousCategorie: categoryMap[product.sousCategorie] || product.sousCategorie,
  }))

  const columnNames = {
    dateSoumission: 'Date',
    reference: 'Référence',
    prixVente: 'Prix Vente',
    prixAchat: 'Prix Achat',
    sousCategorie: 'Sous Catégorie',
    marque: 'Marque',
  }

  const excludedKeys = [
    'description',
    'descriptionCourte',
    'SKU',
    'photos',
    'videos',
    'ficheTechnique',
    'variable',
    '_id',
  ]

  let columns =
    products.length > 0
      ? Object.keys(products[0])
          .filter((key) => !excludedKeys.includes(key))
          .map((key) => {
            let width = 150 // Largeur par défaut

            if (['prixVente', 'prixAchat', 'stock'].includes(key)) {
              width = 90
            }
            if (key === 'stock') {
              width = 60
            }
            if (key === 'sousCategorie') {
              width = 120
            }
            if (key === 'reference') {
              width = 250
            }
            if (key === 'tva') {
              width = 50
            }
            if (key === 'dateSoumission') {
              return {
                field: key,
                headerName: columnNames[key] || capitalizeFirstLetter(key),
                width: 110,
                valueFormatter: (params) =>
                  format(new Date(params.value), 'dd/MM/yyyy'),
              }
            }

            return {
              field: key,
              headerName: columnNames[key] || capitalizeFirstLetter(key),
              width,
            }
          })
      : []

  columns.push({
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 150,
    getActions: (params) => [
      <GridActionsCellItem
        icon={<EditIcon />}
        label="Modifier"
        onClick={() => redirectToEdit(params.id)}
      />,
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Supprimer"
        onClick={() => promptDelete(products.find((p) => p._id === params.id))}
      />,
    ],
  })

  return (
    <DataGrid
      localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
      rows={displayProducts}
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
      onRowSelectionModelChange={onSelectionChange}
      style={{ width: '100%' }}
    />
  )
}

export default ProductCatalog
