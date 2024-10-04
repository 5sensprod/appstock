import React, { useContext } from 'react'
import { CartContext } from '../../contexts/CartContext'
import { DataGridPro, frFR, GridToolbar } from '@mui/x-data-grid-pro'
import { Box } from '@mui/material'
import { formatNumberFrench } from '../../utils/priceUtils'
import { useConfig } from '../../contexts/ConfigContext'

const prepareProductDataForDisplay = (products, baseUrl) => {
  const defaultImageUrl = `${baseUrl}/catalogue/default/default.png`

  const preparedProducts = products.map((product) => {
    const isDefaultImage = !product.featuredImage
    return {
      ...product,
      photoUrl: isDefaultImage
        ? defaultImageUrl
        : `${baseUrl}/catalogue/${product._id}/${product.featuredImage}`,
      isDefaultImage,
    }
  })

  // Trier les produits pour que ceux avec une image s'affichent en premier
  return preparedProducts.sort((a, b) => a.isDefaultImage - b.isDefaultImage)
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
            maxWidth: 100,
            height: 'auto',
            opacity: params.row.isDefaultImage ? 0.06 : 1,
          }}
        />
      ),
      width: 100,
      disableColumnMenu: true,
      sortable: false,
    },
    { field: 'reference', headerName: 'Référence', flex: 2 },
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
        pagination
        pageSizeOptions={[5, 10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
        }}
        onRowClick={handleRowClick}
        getRowId={(row) => row._id}
        style={{ width: '100%' }}
        slots={{ toolbar: GridToolbar }}
      />
    </Box>
  )
}

export default ProductTable
