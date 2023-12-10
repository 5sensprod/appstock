import React, { useContext } from 'react'
import { useProductContext } from '../../contexts/ProductContext'
import { CartContext } from '../../contexts/CartContext'
import { Grid, Paper, Checkbox, Button, Typography, Box } from '@mui/material'

const ProductTable = ({
  products,
  onEdit,
  selectedProducts,
  isBulkEditActive,
  handleProductSelect,
  onProductSelect,
}) => {
  const { baseUrl } = useProductContext()

  const { addToCart } = useContext(CartContext)

  const handleAddToCart = (product) => {
    addToCart(product)
  }

  return (
    <Grid container spacing={2}>
      {/* En-tête du tableau */}
      <Grid item xs={12}>
        <Grid container spacing={2} alignItems="center">
          {isBulkEditActive && (
            <Grid item>
              <Typography>Choisir</Typography>
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Lignes du tableau */}
      {products.map((product) => (
        <Grid
          item
          xs={12}
          key={product._id}
          onClick={() => handleAddToCart(product)}
        >
          <Paper style={{ padding: '10px', cursor: 'pointer' }}>
            <Grid container spacing={2} alignItems="center">
              {isBulkEditActive && (
                <Grid item>
                  <Checkbox
                    checked={selectedProducts.has(product._id)}
                    onChange={() => onProductSelect(product._id)}
                  />
                </Grid>
              )}
              <Grid item>
                {product.photos && product.photos.length > 0 && (
                  <Box
                    component="img"
                    src={`${baseUrl}/${product.photos[0]}`}
                    alt={product.reference}
                    sx={{ width: 100, height: 'auto' }}
                  />
                )}
              </Grid>
              <Grid item>
                <Typography>{product.reference}</Typography>
              </Grid>
              <Grid item>
                <Typography>{product.marque}</Typography>
              </Grid>
              <Grid item>
                <Typography>{product.gencode}</Typography>
              </Grid>
              <Grid item>
                <Typography>{product.prixVente} €</Typography>
              </Grid>
              <Grid item>
                <Button onClick={() => onEdit(product)}>Modifier</Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}

export default ProductTable
