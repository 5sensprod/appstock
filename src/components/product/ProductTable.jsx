// Tableau produits page POS

import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from '../../contexts/CartContext'
import { DataGridPro, frFR, GridToolbar } from '@mui/x-data-grid-pro'
import { Box } from '@mui/material'
import { formatNumberFrench } from '../../utils/priceUtils'
import { useConfig } from '../../contexts/ConfigContext'

const ProductTable = ({ products }) => {
  const { baseUrl } = useConfig()
  const { addToCart } = useContext(CartContext)

  const PREF_KEY = 'productTablePreferences'

  const loadPreferences = () => {
    const savedPrefs = localStorage.getItem(PREF_KEY)
    return savedPrefs
      ? JSON.parse(savedPrefs)
      : {
          columnsVisibility: {},
          density: 'standard',
          paginationModel: { pageSize: 25, page: 0 },
          // ... autres préférences
        }
  }

  const [gridPreferences, setGridPreferences] = useState(loadPreferences())

  useEffect(() => {
    localStorage.setItem(PREF_KEY, JSON.stringify(gridPreferences))
  }, [gridPreferences])

  // Sauvegarder les préférences dans localStorage
  const savePreferences = (newPreferences) => {
    setGridPreferences((prevPreferences) => {
      const updatedPreferences = { ...prevPreferences, ...newPreferences }
      localStorage.setItem(PREF_KEY, JSON.stringify(updatedPreferences))
      console.log(
        'Préférences sauvegardées dans localStorage:',
        updatedPreferences,
      )
      return updatedPreferences
    })
  }

  // Gestion des changements de préférences
  const handleColumnVisibilityChange = (newModel) => {
    savePreferences({ ...gridPreferences, columnsVisibility: newModel })
  }

  const handlePaginationModelChange = (newModel) => {
    savePreferences({ ...gridPreferences, paginationModel: newModel })
  }

  const handleDensityChange = (newDensity) => {
    console.log('Densité modifiée :', newDensity) // Pour vérifier la nouvelle densité
    savePreferences({ ...gridPreferences, density: newDensity })
  }

  const columns = [
    {
      field: 'photo',
      headerName: 'Photo',
      renderCell: (params) =>
        params.row.photos && params.row.photos.length > 0 ? (
          <Box
            component="img"
            src={`${baseUrl}/${params.row.photos[0]}`}
            alt={params.row.reference}
            sx={{ width: 100, height: 'auto' }}
          />
        ) : null,
      flex: 1,
    },
    { field: 'reference', headerName: 'Référence', flex: 1 },
    {
      field: 'prixVente',
      headerName: 'Prix Vente',
      type: 'number',
      flex: 1,
      renderCell: (params) => `${formatNumberFrench(params.value)} €`,
    },
    { field: 'stock', headerName: 'Stock', type: 'number', flex: 1 },
    { field: 'tva', headerName: 'TVA', type: 'number', flex: 1 },
    { field: 'marque', headerName: 'Marque', flex: 1 },
    { field: 'gencode', headerName: 'Gencode', flex: 1 },
  ]

  const handleRowClick = (params) => {
    addToCart(params.row)
  }

  return (
    <Box my={3}>
      <DataGridPro
        localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
        columnVisibilityModel={gridPreferences.columnsVisibility}
        onColumnVisibilityModelChange={handleColumnVisibilityChange}
        density={gridPreferences.density}
        onDensityChange={(params) => handleDensityChange(params.value)}
        rows={products}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: gridPreferences.paginationModel, // Utilisez l'état du contexte
          },
        }}
        pageSize={gridPreferences.paginationModel.pageSize}
        onPageSizeChange={(newPageSize) => {
          handlePaginationModelChange({
            ...gridPreferences.paginationModel,
            pageSize: newPageSize,
          })
        }}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[10, 25, 50]}
        pagination
        onRowClick={handleRowClick}
        getRowId={(row) => row._id}
        style={{ width: '100%' }}
        slots={{ toolbar: GridToolbar }}
      />
    </Box>
  )
}

export default ProductTable
