// src/components/PRODUCTS/ProductsGrid.js
import React from 'react'
import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'
import { useCategoryContext } from '../../contexts/CategoryContext'
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
    { field: 'reference', headerName: 'Référence', width: 150 },
    {
      field: 'prixVente',
      headerName: 'Prix de Vente',
      type: 'number',
      width: 130,
      editable: true,
    },
    {
      field: 'descriptionCourte',
      headerName: 'Description Courte',
      width: 200,
    },
    {
      field: 'categorie',
      headerName: 'Catégorie',
      width: 150,
      valueGetter: (params) => {
        const category = categories.find((cat) => cat._id === params.value)
        return category ? category.name : 'Non classifié'
      },
    },
    { field: 'marque', headerName: 'Marque', width: 150 },
    { field: 'SKU', headerName: 'SKU', width: 150 },
    {
      field: 'dateSoumission',
      headerName: 'Date de Soumission',
      type: 'date',
      width: 180,
      valueGetter: (params) =>
        moment(params.value).isValid() ? moment(params.value).toDate() : null,
    },
    { field: 'tva', headerName: 'TVA', type: 'number', width: 100 },
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
    <div style={{ height: 600, width: '100%' }}>
      <DataGridPro
        rows={filteredProducts}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        checkboxSelection
        getRowId={(row) => row._id}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        slots={{
          toolbar: GridToolbar,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
    </div>
  )
}

export default ProductsGrid
