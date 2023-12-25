import React, { useContext, useEffect, useRef, useState, useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { Button, TextField } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import frenchLocale from '../locales/frenchLocale'
import { useCategoryContext } from '../../contexts/CategoryContext'

const SimplifiedCategoryTreeGrid = () => {
  const {
    categories,
    subCategoryCounts,
    updateCategoryInContext,
    deleteCategoryFromContext,
    productCountByCategory,
  } = useCategoryContext()

  const [searchText, setSearchText] = useState('')
  const gridApi = useRef(null)

  const onCellValueChanged = async ({ data, oldValue, newValue, colDef }) => {
    // Assurez-vous que la modification concerne la colonne 'name'
    if (colDef.field === 'name' && oldValue !== newValue) {
      // Extrait uniquement le nom de la catégorie de la nouvelle valeur
      const updatedName = newValue.split(' (')[0]
      try {
        await updateCategoryInContext(data._id, { name: updatedName })
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la catégorie:', error)
      }
    }
  }

  const mapPath = (categoryId) => {
    const path = []
    let current = categoryId
    while (current) {
      const category = categories.find((cat) => cat._id === current)
      if (category) {
        path.unshift(category.name) // Utiliser seulement le nom de la catégorie
        current = category.parentId
      } else {
        break
      }
    }
    return path
  }

  const rowData = useMemo(() => {
    return categories.map((cat) => ({
      ...cat,
      path: mapPath(cat._id),
    }))
  }, [categories])

  const columns = useMemo(
    () => [
      {
        headerName: 'Produits',
        field: 'productCount',
        cellRendererFramework: (params) => {
          const productCount = productCountByCategory[params.data._id] || 0
          return <span>{productCount}</span>
        },
      },
      {
        headerName: 'Actions',
        field: 'actions',
        cellRendererFramework: (params) => (
          <Button
            onClick={() => handleDeleteCategory(params.data._id)}
            color="error"
          >
            <DeleteIcon />
          </Button>
        ),
        maxWidth: 150,
      },
    ],
    [subCategoryCounts],
  )

  const handleDeleteCategory = async (categoryId) => {
    // Ici, vous pouvez ajouter une logique de confirmation avant la suppression
    await deleteCategoryFromContext(categoryId)
  }

  const updateSearch = (searchValue) => {
    setSearchText(searchValue)
    gridApi.current?.setQuickFilter(searchValue)
  }

  const autoGroupColumnDef = useMemo(
    () => ({
      headerName: 'Catégories',
      field: 'name',
      editable: true,
      resizable: true,
      minWidth: 300,
      maxWidth: 600,
      cellRendererParams: {
        innerRenderer: (params) => {
          // Comptage des sous-catégories uniquement pour les nœuds de groupe
          if (params.node.group) {
            const subCategoryCount =
              subCategoryCounts.find((count) => count._id === params.node.key)
                ?.childCount || 0
            return (
              <span>
                {params.value} ({subCategoryCount})
              </span>
            )
          } else {
            return <span>{params.value}</span>
          }
        },
      },
    }),
    [subCategoryCounts],
  )

  return (
    <div className="ag-theme-material" style={{ height: 600, width: '100%' }}>
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
        onGridReady={(params) => {
          gridApi.current = params.api
        }}
        columnDefs={columns}
        pagination={true}
        paginationPageSize={15}
        rowData={rowData}
        treeData={true}
        animateRows={true}
        groupDefaultExpanded={0}
        getDataPath={(data) => data.path}
        autoGroupColumnDef={autoGroupColumnDef}
        onCellValueChanged={onCellValueChanged}
        domLayout="autoHeight"
      />
    </div>
  )
}

export default SimplifiedCategoryTreeGrid
