import React, { useEffect, useState } from 'react'
import { DataGridPro } from '@mui/x-data-grid-pro'
import { useCategoryContext } from '../../contexts/CategoryContext'

const CategoryTable = () => {
  const { categories } = useCategoryContext() || { categories: [] }
  const [rows, setRows] = useState([])

  useEffect(() => {
    if (categories && categories.length > 0) {
      const formattedRows = categories.map((cat) => ({
        id: cat._id,
        name: cat.name,
        parentId: cat.parentId, // Assurez-vous que ceci est correctement défini
      }))
      setRows(formattedRows)
    }
  }, [categories])

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    // Autres colonnes si nécessaire
  ]
  const getTreeDataPath = (row) => {
    let path = []
    let currentRow = row

    while (currentRow) {
      path.unshift(currentRow.name) // Utilisez le champ que vous voulez pour identifier le chemin
      currentRow = rows.find((r) => r.id === currentRow.parentId)
    }

    return path
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        rows={rows}
        columns={columns}
        treeData
        getTreeDataPath={getTreeDataPath}
      />
    </div>
  )
}

export default CategoryTable
