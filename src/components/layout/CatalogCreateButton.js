import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'

const CatalogCreateButton = ({ theme }) => {
  const location = useLocation()

  if (location.pathname === '/catalog') {
    return (
      <Fab
        component={Link}
        to="/create-product"
        color="primary"
        sx={{ margin: theme.spacing(0) }}
        size="small"
      >
        <AddIcon />
      </Fab>
    )
  }
  return null
}

export default CatalogCreateButton
