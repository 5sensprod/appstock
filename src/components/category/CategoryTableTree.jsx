import React, { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { useProductContext } from '../../contexts/ProductContext'
import { useUI } from '../../contexts/UIContext'
import DeleteIcon from '@mui/icons-material/Delete'
import useCategoryData from '../hooks/useCategoryData'

const CategoryTreeGrid = () => {
  const { categories, updateCategoryInContext, deleteCategoryFromContext } =
    useProductContext()
  const { showToast, showConfirmDialog } = useUI()
  const { rowData, promptDeleteWithConfirmation } = useCategoryData(
    categories,
    deleteCategoryFromContext,
    showToast,
    showConfirmDialog,
  )

  const onCellValueChanged = async ({ data, oldValue, newValue, colDef }) => {
    if (colDef.field === 'name' && oldValue !== newValue) {
      try {
        await updateCategoryInContext(data._id, { name: newValue })
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la catégorie:', error)
      }
    }
  }

  const columns = [
    {
      headerName: 'Actions',
      field: 'actions',
      cellRendererFramework: (params) => (
        <button
          onClick={() => promptDeleteWithConfirmation(params.data)}
          style={{ border: 'none', background: 'none' }}
        >
          <DeleteIcon />
        </button>
      ),
    },
  ]

  const autoGroupColumnDef = {
    headerName: 'Catégories',
    field: 'name',
    editable: true,
    resizable: true,
    cellRendererParams: {
      suppressCount: true,
      innerRenderer: (params) => {
        // Vérifie si l'élément a des enfants
        if (params.data.numberOfChildren > 0) {
          return `${params.value} (${params.data.numberOfChildren})`
        }
        return params.value
      },
    },
  }

  return (
    <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
      <AgGridReact
        columnDefs={columns}
        rowData={rowData}
        treeData={true}
        animateRows={true}
        groupDefaultExpanded={-1}
        getDataPath={(data) => data.path}
        autoGroupColumnDef={autoGroupColumnDef}
        onCellValueChanged={onCellValueChanged}
      />
    </div>
  )
}

export default CategoryTreeGrid
