import React, { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-material.css'
import { getCategories, updateCategory } from '../../api/categoryService'

const CategoryTreeGrid = () => {
  const [rowData, setRowData] = useState([])

  const columns = [
    { field: 'name', sortable: true, filter: true, editable: true },
    { field: '_id', sortable: true, filter: true, editable: true },
  ]

  useEffect(() => {
    getCategories().then((data) => {
      const idToCategoryMap = data.reduce((acc, category) => {
        acc[category._id] = category
        return acc
      }, {})

      const getPath = (category) => {
        let path = [category.name]
        let current = category
        while (current.parentId && idToCategoryMap[current.parentId]) {
          current = idToCategoryMap[current.parentId]
          path.unshift(current.name)
        }
        return path
      }

      const processedData = data.map((category) => ({
        ...category,
        path: getPath(category),
      }))

      setRowData(processedData)
    })
  }, [])

  const onCellValueChanged = async ({ data }) => {
    try {
      await updateCategory(data._id, { name: data.name })
      // Optionnel : Mettez à jour l'état local si nécessaire
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error)
      // Gérer les erreurs, par exemple en rétablissant l'ancienne valeur si nécessaire
    }
  }

  return (
    <div className="ag-theme-material" style={{ height: 600, width: '100%' }}>
      <AgGridReact
        columnDefs={columns}
        rowData={rowData}
        treeData={true}
        animateRows={true}
        groupDefaultExpanded={-1}
        getDataPath={(data) => data.path}
        autoGroupColumnDef={{
          headerName: 'Category',
          field: 'name',
          cellRendererParams: {
            suppressCount: true,
          },
        }}
        onCellValueChanged={onCellValueChanged}
      />
    </div>
  )
}

export default CategoryTreeGrid
