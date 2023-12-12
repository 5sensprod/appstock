import React from 'react'
import { DataGrid, frFR, GridActionsCellItem } from '@mui/x-data-grid'
import { capitalizeFirstLetter } from '../../utils/formatUtils'
import { useProductContext } from '../../contexts/ProductContext'
import { deleteProduct } from '../../api/productService'
import DeleteIcon from '@mui/icons-material/Delete'
import { format } from 'date-fns'
import { useUI } from '../../contexts/UIContext'
import EditIcon from '@mui/icons-material/Edit'
import { useNavigate } from 'react-router-dom'

const CatalogPage = () => {
  const { categories, products, setProducts } = useProductContext()
  const { showConfirmDialog, showToast } = useUI()
  const navigate = useNavigate()

  const redirectToEdit = (productId) => {
    navigate(`/edit-product/${productId}`)
  }

  // Création d'un mappage pour les noms de catégories
  const categoryMap = categories.reduce((acc, category) => {
    acc[category._id] = category.name
    return acc
  }, {})

  const promptDelete = (product) => {
    showConfirmDialog(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer le produit "${product.reference}" ? Cette action est irréversible.`,
      () => handleDelete(product),
    )
  }

  const handleDelete = async (product) => {
    try {
      await deleteProduct(product._id)
      const updatedProducts = products.filter((p) => p._id !== product._id)
      setProducts(updatedProducts)
      showToast(
        `Produit "${product.reference}" supprimé avec succès`,
        'success',
      )
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error)
      showToast(`Erreur lors de la suppression du produit`, 'error')
    }
  }

  const columnNames = {
    dateSoumission: 'Date',
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
      .map((key) => {
        let width = 150 // Largeur par défaut

        // Réduire la largeur pour les colonnes spécifiques
        if (key === 'prixVente' || key === 'prixAchat' || key === 'stock') {
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

        // Ajout de la condition pour la colonne 'dateSoumission'
        if (key === 'dateSoumission') {
          return {
            field: key,
            headerName: columnNames[key] || capitalizeFirstLetter(key),
            width: 110, // ou une autre largeur appropriée pour les dates
            valueFormatter: (params) => {
              return params.value
                ? format(new Date(params.value), 'dd/MM/yyyy')
                : ''
            },
          }
        }

        // Configuration des autres colonnes
        return {
          field: key,
          headerName: columnNames[key] || capitalizeFirstLetter(key),
          width,
        }
      })
  }

  columns.push({
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 150, // Vous pouvez ajuster la largeur selon vos besoins
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
