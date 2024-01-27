import React, { useMemo } from 'react'
import { DataGrid, frFR, GridActionsCellItem } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import moment from 'moment'
import { capitalizeFirstLetter } from '../../utils/formatUtils'
import { createCategoryMap, formatProducts } from '../../utils/productUtils'

const columnFlex = {
  prixVente: 0.5,
  prixAchat: 0.5,
  stock: 0.5,
  categorie: 1.5,
  reference: 2,
  tva: 0.5,
}

const columnNames = {
  dateSoumission: 'Date',
  reference: 'Référence',
  prixVente: 'Prix Vente',
  prixAchat: 'Prix Achat',
  categorie: 'Catégorie',
  marque: 'Marque',
}

const excludedKeys = [
  'id',
  'description',
  'descriptionCourte',
  'SKU',
  'sousCategorie',
  'photos',
  'videos',
  'ficheTechnique',
  'variable',
  '_id',
]

const generateColumns = (products, redirectToEdit) => {
  let columns =
    products.length > 0
      ? Object.keys(products[0])
          .filter((key) => !excludedKeys.includes(key))
          .map((key) => {
            let column = {
              field: key,
              headerName: columnNames[key] || capitalizeFirstLetter(key),
              flex: columnFlex[key] || 1,
            }

            if (key === 'dateSoumission') {
              column.valueFormatter = (params) =>
                moment(params.value).format('DD/MM/YYYY')
            } else if (key === 'prixVente' || key === 'prixAchat') {
              column.valueFormatter = ({ value }) =>
                value || value === 0 ? `${value} €` : ''
            } else if (key === 'tva') {
              column.valueFormatter = ({ value }) =>
                value || value === 0 ? `${value} %` : ''
            }

            return column
          })
      : []

  columns.push({
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    flex: 1,
    getActions: (params) => [
      <GridActionsCellItem
        icon={<EditIcon />}
        label="Modifier"
        onClick={() => redirectToEdit(params.id)}
      />,
    ],
  })

  return columns
}

const ProductCatalog = ({ products, redirectToEdit, categories }) => {
  const categoryMap = useMemo(() => createCategoryMap(categories), [categories])
  const displayProducts = useMemo(
    () => formatProducts(products, categoryMap),
    [products, categoryMap],
  )

  const columns = useMemo(
    () => generateColumns(products, redirectToEdit),
    [products, redirectToEdit],
  )

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        Aucun produit trouvé pour cette catégorie.
      </div>
    )
  }

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
      style={{ width: '100%' }}
    />
  )
}

export default ProductCatalog
