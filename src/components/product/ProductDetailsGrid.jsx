import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { useProductContext } from '../../contexts/ProductContext'

const ProductDetailsGrid = ({ productIds }) => {
  const { products } = useProductContext()

  const filteredProducts = products.filter((product) =>
    productIds.includes(product._id),
  )

  const columnDefs = [
    { field: 'reference', headerName: 'Référence' },
    { field: 'prixVente', headerName: 'Prix de Vente' },
    // ...autres champs selon les détails de vos produits...
  ]

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <AgGridReact
        rowData={filteredProducts}
        columnDefs={columnDefs}
        domLayout="autoHeight"
      />
    </div>
  )
}

export default ProductDetailsGrid
