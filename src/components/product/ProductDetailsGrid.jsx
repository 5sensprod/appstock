import React, { useMemo, useEffect, useRef, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-material.css'
import { useProductContext } from '../../contexts/ProductContext'
import { filterAndFormatProducts } from '../../utils/productUtils'
import frenchLocale from '../locales/frenchLocale'

const ProductDetailsGrid = ({ productIds }) => {
  const { products, categories } = useProductContext()

  const filteredProducts = filterAndFormatProducts(
    products,
    productIds,
    categories,
  )

  const gridApi = useRef(null)

  const autoSizeStrategy = useMemo(() => {
    return {
      type: 'fitGridWidth',
    }
  }, [])

  const onGridReady = useCallback((params) => {
    gridApi.current = params.api
    setTimeout(() => params.api.sizeColumnsToFit(), 100)

    window.addEventListener('resize', () => {
      setTimeout(() => params.api.sizeColumnsToFit(), 100)
    })
  }, [])

  useEffect(() => {
    if (gridApi.current) {
      gridApi.current.sizeColumnsToFit()
    }
  }, [filteredProducts])

  const columnDefs = [
    { field: 'reference', headerName: 'Référence', resizable: true },
    { field: 'prixVente', headerName: 'Prix Vente', resizable: true },
    // { field: 'descriptionCourte', headerName: 'Description Courte', resizable: true },
    { field: 'prixAchat', headerName: "Prix d'Achat", resizable: true },
    { field: 'stock', headerName: 'Stock', resizable: true },
    { field: 'tva', headerName: 'TVA', resizable: true },
    { field: 'marque', headerName: 'Marque', resizable: true },
    { field: 'categorie', headerName: 'Catégorie', resizable: true },
    { field: 'sousCategorie', headerName: 'Sous-Catégorie', resizable: true },
    { field: 'dateSoumission', headerName: 'Date Ajout', resizable: true },
    // Ajoutez la propriété resizable à d'autres champs selon les détails de vos produits
  ]

  const onFirstDataRendered = (params) => {
    if (autoSizeStrategy.type === 'fitGridWidth') {
      const allColumnIds = params.columnApi
        .getAllColumns()
        .map((column) => column.colId)
      params.columnApi.autoSizeColumns(allColumnIds)
    }
  }
  return (
    <div
      className="ag-theme-material"
      style={{ height: 400, width: '100%', minWidth: 1024 }}
    >
      <AgGridReact
        localeText={frenchLocale}
        rowData={filteredProducts}
        columnDefs={columnDefs}
        onGridReady={onGridReady}
        onFirstDataRendered={onFirstDataRendered}
        domLayout="autoHeight"
        autoSizeStrategy={autoSizeStrategy}
      />
    </div>
  )
}

export default ProductDetailsGrid
