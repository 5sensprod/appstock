import React, { useMemo } from 'react'
import { DataGrid, frFR, GridActionsCellItem } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { format } from 'date-fns'
import { capitalizeFirstLetter } from '../../utils/formatUtils'
import { createCategoryMap, formatProducts } from '../../utils/productUtils'

const columnWidths = {
  prixVente: 90,
  prixAchat: 90,
  stock: 60,
  sousCategorie: 120,
  reference: 250,
  tva: 70,
}

const columnNames = {
  dateSoumission: 'Date',
  reference: 'Référence',
  prixVente: 'Prix Vente',
  prixAchat: 'Prix Achat',
  sousCategorie: 'Sous Catégorie',
  marque: 'Marque',
}

const excludedKeys = [
  'id',
  'description',
  'descriptionCourte',
  'SKU',
  'photos',
  'videos',
  'ficheTechnique',
  'variable',
  '_id',
]

const generateColumns = (products, redirectToEdit, promptDelete) => {
  let columns =
    products.length > 0
      ? Object.keys(products[0])
          .filter((key) => !excludedKeys.includes(key))
          .map((key) => {
            const width = columnWidths[key] || 150
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

  return columns
}

const ProductCatalog = ({
  products,
  onSelectionChange,
  redirectToEdit,
  promptDelete,
  categories,
}) => {
  const categoryMap = useMemo(() => createCategoryMap(categories), [categories])
  const displayProducts = useMemo(
    () => formatProducts(products, categoryMap),
    [products, categoryMap],
  )

  const columns = useMemo(
    () => generateColumns(products, redirectToEdit, promptDelete),
    [products, redirectToEdit, promptDelete],
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
      checkboxSelection
      onRowSelectionModelChange={onSelectionChange}
      style={{ width: '100%' }}
    />
  )
}

export default ProductCatalog
