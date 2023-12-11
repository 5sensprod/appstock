import React, { useState } from 'react'
import { DataGrid, frFR, GridActionsCellItem } from '@mui/x-data-grid'
import { capitalizeFirstLetter } from '../../utils/formatUtils'
import { useProductContext } from '../../contexts/ProductContext'
import { deleteProduct } from '../../api/productService'
import DeleteIcon from '@mui/icons-material/Delete'
import ConfirmationDialog from '../ui/ConfirmationDialog'
import Toast from '../ui/Toast'
import { format } from 'date-fns'

const CatalogPage = () => {
  const { categories, products, setProducts } = useProductContext()
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [productToDelete, setProductToDelete] = React.useState(null)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Création d'un mappage pour les noms de catégories
  const categoryMap = categories.reduce((acc, category) => {
    acc[category._id] = category.name
    return acc
  }, {})

  const promptDelete = (id) => {
    setProductToDelete(id)
    setConfirmOpen(true)
  }

  const handleDelete = async () => {
    try {
      await deleteProduct(productToDelete._id)
      const updatedProducts = products.filter(
        (product) => product._id !== productToDelete._id,
      )
      setProducts(updatedProducts)
      setConfirmOpen(false) // Fermer la boîte de dialogue
      setToastMessage(
        `Produit "${productToDelete.reference}" supprimé avec succès`,
      )
      setToastOpen(true)
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error)
      setToastMessage(`Erreur lors de la suppression du produit`)
      setToastOpen(true)
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

        // Ajout de la condition pour la colonne 'dateSoumission'
        if (key === 'dateSoumission') {
          return {
            field: key,
            headerName: columnNames[key] || capitalizeFirstLetter(key),
            width: 180, // ou une autre largeur appropriée pour les dates
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
    width: 100,
    getActions: (params) => [
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
      <ConfirmationDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        content={`Êtes-vous sûr de vouloir supprimer le produit "${productToDelete?.reference}" ? Cette action est irréversible.`}
      />
      <Toast
        open={toastOpen}
        handleClose={() => setToastOpen(false)}
        message={toastMessage}
        severity="success" // ou "error" selon le contexte
      />
    </div>
  )
}

export default CatalogPage
