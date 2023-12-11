import React from 'react'
import { DataGrid, frFR } from '@mui/x-data-grid'
import useProducts from '../hooks/useProducts'
import { capitalizeFirstLetter } from '../../utils/formatUtils'
import { useProductContext } from '../../contexts/ProductContext'

const CatalogPage = () => {
  const products = useProducts()
  const { categories } = useProductContext()

  // Création d'un mappage pour les noms de catégories
  const categoryMap = categories.reduce((acc, category) => {
    acc[category._id] = category.name
    return acc
  }, {})

  const columnNames = {
    reference: 'Référence',
    prixVente: 'Prix Vente',
    prixAchat: 'Prix Achat',
    sousCategorie: 'Sous Catégorie',
    marque: 'Marque',
  }

  const transformedProducts = products.map((product) => ({
    ...product,
    id: product._id,
    categorie: categoryMap[product.categorie] || product.categorie,
    sousCategorie: categoryMap[product.sousCategorie] || product.sousCategorie,
  }))

  // Exclure certaines clés de l'objet produit
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

  // Création dynamique des colonnes pour DataGrid
  let columns = []
  if (products.length > 0) {
    columns = Object.keys(products[0])
      .filter((key) => !excludedKeys.includes(key))
      .map((key) => ({
        field: key,
        headerName: columnNames[key] || capitalizeFirstLetter(key),
        width: 150,
      }))
  }

  return (
    <div style={{ width: 'fit-content', maxWidth: '100%' }}>
      <DataGrid
        localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
        rows={transformedProducts}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10, 25, 50]}
        checkboxSelection
      />
    </div>
  )
}

export default CatalogPage
