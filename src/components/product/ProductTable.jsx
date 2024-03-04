// Tableau produits page POS

import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from '../../contexts/CartContext'
import { DataGridPro, frFR, GridToolbar } from '@mui/x-data-grid-pro'
import { Box } from '@mui/material'
import { formatNumberFrench } from '../../utils/priceUtils'
import { useConfig } from '../../contexts/ConfigContext'

const prepareProductDataForDisplay = (products, baseUrl) => {
  const defaultImageUrl = `${baseUrl}/catalogue/default/default.png`

  return products.map((product) => {
    const isDefaultImage = !product.featuredImage
    return {
      ...product,
      photoUrl: isDefaultImage
        ? defaultImageUrl
        : `${baseUrl}/catalogue/${product._id}/${product.featuredImage}`,
      isDefaultImage, // Ajout de cette propriété pour chaque produit
    }
  })
}

const ProductTable = ({ products }) => {
  const { baseUrl } = useConfig()
  const preparedProducts = prepareProductDataForDisplay(products, baseUrl)
  const { addToCart } = useContext(CartContext)
  const defaultImageUrl = `${baseUrl}/catalogue/default/default.png`

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
    savePreferences({ ...gridPreferences, density: newDensity })
  }

  const columns = [
    {
      field: 'photo',
      headerName: 'Photo',
      renderCell: (params) => (
        <Box
          component="img"
          src={params.row.photoUrl}
          alt={params.row.reference}
          sx={{
            width: 100,
            height: 'auto',
            opacity: params.row.isDefaultImage ? 0.06 : 1,
          }}
        />
      ),
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
    },
    { field: 'reference', headerName: 'Référence', flex: 1 },
    {
      field: 'prixVente',
      headerName: 'Prix Vente',
      type: 'number',
      flex: 1,
      renderCell: (params) => `${formatNumberFrench(params.value)} €`,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'stock',
      headerName: 'Stock',
      type: 'number',
      flex: 1,
      sortable: false,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'tva',
      headerName: 'TVA',
      type: 'number',
      flex: 1,
      valueFormatter: (params) => {
        return `${params.value}%` // Ajouter un symbole de pourcentage à la valeur
      },
      headerAlign: 'left',
      align: 'left',
      disableColumnMenu: true,
    },
    { field: 'marque', headerName: 'Marque', flex: 1 },
    {
      field: 'gencode',
      headerName: 'Gencode',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
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
        rows={preparedProducts}
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
