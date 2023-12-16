import React, { useState, useEffect, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-material.css'
import { useProductContext } from '../../contexts/ProductContext'
import { useUI } from '../../contexts/UIContext'
import DeleteIcon from '@mui/icons-material/Delete'
import useCategoryData from '../hooks/useCategoryData'
import { TextField, Button } from '@mui/material'
import frenchLocale from '../locales/frenchLocale'

const CategoryTreeGrid = () => {
  const {
    categories,
    updateCategoryInContext,
    deleteCategoryFromContext,
    fetchProductCountByCategory,
    productCountByCategory,
  } = useProductContext()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { showToast, showConfirmDialog } = useUI()
  const [searchText, setSearchText] = useState('')
  const gridApi = useRef(null)

  const { rowData, promptDeleteWithConfirmation } = useCategoryData(
    categories,
    deleteCategoryFromContext,
    showToast,
    showConfirmDialog,
  )
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProductCountByCategory()
        setLoading(false)
      } catch (err) {
        setError(err)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const onGridReady = (params) => {
    gridApi.current = params.api
    // ... peut-être charger des données ou d'autres opérations initiales
  }

  const updateSearch = (searchValue) => {
    setSearchText(searchValue)
    if (gridApi.current) {
      // Définit le filtre rapide qui va filtrer les nœuds
      gridApi.current.setQuickFilter(searchValue)

      // Si le filtre de recherche n'est pas vide, parcourez tous les nœuds et dépliez les parents
      if (searchValue) {
        gridApi.current.forEachNode((node) => {
          if (node.data && node.data.name.includes(searchValue)) {
            let parentNode = node.parent
            while (parentNode && parentNode.level >= 0) {
              parentNode.setExpanded(true)
              parentNode = parentNode.parent
            }
          }
        })
      }
    }
  }
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
      headerName: 'Déplacement',
      width: 50,
      rowDrag: true,
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 180,
      minWidth: 100,
      cellRenderer: (params) => (
        <Button
          onClick={() => promptDeleteWithConfirmation(params.data)}
          style={{ border: 'none', background: 'none' }}
        >
          <DeleteIcon />
        </Button>
      ),
    },
    {
      headerName: 'Nombre de Produits',
      field: '_id',
      width: 150,
      cellRenderer: (params) => {
        return productCountByCategory[params.value]?.count || 'Aucun'
      },
    },
  ]

  const autoGroupColumnDef = {
    headerName: 'Catégories',
    field: 'name',
    editable: true,
    resizable: true,
    minWidth: 300,
    maxWidth: 600,
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
    <div
      className="ag-theme-material"
      style={{ height: 650, width: '100%', maxWidth: 900 }}
    >
      <TextField
        value={searchText}
        onChange={(e) => updateSearch(e.target.value)}
        variant="outlined"
        placeholder="Chercher..."
        size="small"
        style={{ marginBottom: '10px', width: '100%' }}
      />
      <AgGridReact
        localeText={frenchLocale}
        onGridReady={onGridReady}
        columnDefs={columns}
        pagination={true} // Active la pagination
        paginationPageSize={10}
        rowData={rowData}
        treeData={true}
        animateRows={true}
        rowDragManaged={true}
        groupDefaultExpanded={0}
        getDataPath={(data) => data.path}
        autoGroupColumnDef={autoGroupColumnDef}
        onCellValueChanged={onCellValueChanged}
      />
    </div>
  )
}

export default CategoryTreeGrid
