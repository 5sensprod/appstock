import React, { useContext } from 'react'
import { CartContext } from '../../contexts/CartContext'
import { DataGridPro, frFR, GridToolbar } from '@mui/x-data-grid-pro'
import { Box } from '@mui/material'
import { formatNumberFrench } from '../../utils/priceUtils'
import { useConfig } from '../../contexts/ConfigContext'
import { formatNumberWithComma } from '../../utils/formatUtils'

const prepareProductDataForDisplay = (products, baseUrl) => {
  const defaultImageUrl = `${baseUrl}/catalogue/default/default.png`

  return products.map((product) => {
    const isDefaultImage = !product.featuredImage
    return {
      ...product,
      photoUrl: isDefaultImage
        ? defaultImageUrl
        : `${baseUrl}/catalogue/${product._id}/${product.featuredImage}`,
      isDefaultImage,
    }
  })
}

const ProductTable = ({ products }) => {
  const { baseUrl } = useConfig()
  const preparedProducts = prepareProductDataForDisplay(products, baseUrl)
  const { addToCart } = useContext(CartContext)

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
        return `${formatNumberWithComma(params.value)}`
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
        rows={preparedProducts}
        columns={columns}
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
