import React, { useContext, useEffect, useRef, useState, useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { Button, TextField } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import frenchLocale from '../locales/frenchLocale'
import { useCategoryContext } from '../../contexts/CategoryContext'

const SimplifiedCategoryTreeGrid = () => {
  const { categories, updateCategoryInContext, deleteCategoryFromContext } =
    useCategoryContext()
  const [searchText, setSearchText] = useState('')
  const gridApi = useRef(null)

  const mapPath = (categoryId, path = []) => {
    const category = categories.find((cat) => cat._id === categoryId)
    if (category) {
      path.unshift(category.name)
      if (category.parentId) {
        mapPath(category.parentId, path)
      }
    }
    return path
  }

  const rowData = useMemo(
    () =>
      categories.map((cat) => ({
        ...cat,
        path: mapPath(cat._id),
      })),
    [categories],
  )

  const columns = useMemo(
    () => [
      // Vos autres colonnes ici
      {
        headerName: 'Nom',
        field: 'name',
        minWidth: 300,
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
    [],
  )

  const handleDeleteCategory = async (categoryId) => {
    // Ici, vous pouvez ajouter une logique de confirmation avant la suppression
    await deleteCategoryFromContext(categoryId)
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
        suppressCount: true,
      },
    }),
    [],
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
