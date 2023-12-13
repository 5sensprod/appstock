import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const CatalogCreateButton = ({ theme }) => {
  const location = useLocation()

  if (location.pathname === '/catalog') {
    return (
      <Button
        component={Link}
        to="/create-product"
        variant="contained"
        color="primary"
        sx={{ margin: theme.spacing(0) }}
      >
        Créer un Produit
      </Button>
    )
  }
  return null
}

export default CatalogCreateButton
