import React from 'react'
import { DataGrid, frFR, GridActionsCellItem } from '@mui/x-data-grid'
import { capitalizeFirstLetter } from '../../utils/formatUtils'
import { useProductContext } from '../../contexts/ProductContext'
import { deleteProduct, getProducts } from '../../api/productService'
import DeleteIcon from '@mui/icons-material/Delete'

const CatalogPage = () => {
  const { categories, products, setProducts } = useProductContext()

  // Création d'un mappage pour les noms de catégories
  const categoryMap = categories.reduce((acc, category) => {
    acc[category._id] = category.name
    return acc
  }, {})

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id)
      const updatedProducts = products.filter((product) => product._id !== id)
      setProducts(updatedProducts) // Mise à jour de l'état des produits dans le contexte
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error)
      // Gérer l'erreur ici
    }
  }

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

  columns.push({
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 100,
    getActions: (params) => [
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Supprimer"
        onClick={() => handleDelete(params.id)}
      />,
    ],
  })

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
        pagination
        checkboxSelection
        checkboxSelectionVisibleOnly={true}
      />
    </div>
  )
}

export default CatalogPage
