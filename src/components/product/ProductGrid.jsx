import React, { useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-material.css'
import { useProductContext } from '../../contexts/ProductContext'
import { filterAndFormatProducts } from '../../utils/productUtils' // Importez la fonction
import useColumnAutoSize from '../hooks/useColumnAutoSize'
import frenchLocale from '../locales/frenchLocale'

const ProductGrid = ({ products, categories }) => {
  const { updateProductInContext } = useProductContext()
  const formattedProducts = filterAndFormatProducts(
    products,
    products.map((p) => p._id),
    categories,
  )
  const autoSizeStrategy = useMemo(
    () => ({
      type: 'fitGridWidth',
    }),
    [],
  )

  const { onGridReady, onFirstDataRendered } =
    useColumnAutoSize(autoSizeStrategy)

  const columnDefs = [
    {
      field: 'reference',
      headerName: 'Référence',
      resizable: true,
      editable: true,
      sortable: true,
    },
    {
      field: 'prixVente',
      headerName: 'Prix Vente',
      resizable: true,
      editable: true,
      sortable: true,
    },
    {
      field: 'prixAchat',
      headerName: "Prix d'Achat",
      resizable: true,
      editable: true,
      sortable: true,
    },
    {
      field: 'stock',
      headerName: 'Stock',
      resizable: true,
      editable: true,
      sortable: true,
    },
    // ... Ajoutez 'sortable: true' pour d'autres colonnes si nécessaire
    { field: 'tva', headerName: 'TVA', resizable: true },
    { field: 'marque', headerName: 'Marque', resizable: true, sortable: true },
    // {
    //   field: 'categorie',
    //   headerName: 'Catégorie',
    //   resizable: true,
    //   sortable: true,
    // },
    // {
    //   field: 'sousCategorie',
    //   headerName: 'Sous-Catégorie',
    //   resizable: true,
    //   sortable: true,
    // },
    // {
    //   field: 'dateSoumissionFormatted',
    //   headerName: 'Date Ajout',
    //   resizable: true,
    //   sortable: true,
    // },
  ]
  const onCellValueChanged = (params) => {
    const { data, colDef } = params
    const field = colDef.field
    let value = data[field]

    if (
      field === 'prixVente' ||
      field === 'prixAchat' ||
      field === 'stock' ||
      field === 'tva'
    ) {
      value = parseFloat(value)
      if (isNaN(value)) {
        console.error('La valeur doit être un nombre')
        return // Ne pas mettre à jour si la valeur n'est pas un nombre
      }
    }

    const updateData = { id: data.id, [field]: value }

    updateProductInContext(data.id, updateData)
  }

  return (
    <div
      className="ag-theme-material"
      style={{ height: 400, width: '100%', minWidth: 1024 }}
    >
      <AgGridReact
        localeText={frenchLocale}
        rowData={formattedProducts} // Utilisez les produits formatés
        columnDefs={columnDefs}
        onGridReady={onGridReady}
        onFirstDataRendered={onFirstDataRendered}
        onCellValueChanged={onCellValueChanged}
        domLayout="autoHeight"
      />
    </div>
  )
}

export default ProductGrid
