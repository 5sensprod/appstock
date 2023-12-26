// src/components/PRODUCTS/ProductsGrid.js
import React from 'react'
import { DataGridPro } from '@mui/x-data-grid-pro'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'
import { useCategoryContext } from '../../contexts/CategoryContext'
import moment from 'moment'

const ProductsGrid = ({ selectedCategoryId }) => {
  const { products, searchTerm } = useProductContextSimplified()
  const { categories } = useCategoryContext()

  // Filtrer les produits en fonction du searchTerm
  const filteredProducts = products.filter((product) => {
    // Filtrage par terme de recherche
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    const reference = product.reference
      ? product.reference.toLowerCase().includes(lowerCaseSearchTerm)
      : false
    const descriptionCourte = product.descriptionCourte
      ? product.descriptionCourte.toLowerCase().includes(lowerCaseSearchTerm)
      : false
    const marque = product.marque
      ? product.marque.toLowerCase().includes(lowerCaseSearchTerm)
      : false
    const matchesSearch = reference || descriptionCourte || marque

    // Filtrage par catégorie
    const matchesCategory = selectedCategoryId
      ? product.categorie === selectedCategoryId
      : true

    return matchesSearch && matchesCategory
  })

  const columns = [
    { field: 'reference', headerName: 'Référence', width: 150 },
    {
      field: 'prixVente',
      headerName: 'Prix de Vente',
      type: 'number',
      width: 130,
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

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGridPro
        rows={filteredProducts}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  )
}

export default ProductsGrid
