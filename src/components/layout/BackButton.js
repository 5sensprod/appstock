import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const BackButton = ({ theme }) => {
  const location = useLocation()

  const matchCreateOrEdit = location.pathname.match(
    /\/create-product|\/edit-product\/.+/,
  )

  if (matchCreateOrEdit) {
    return (
      <Button
        component={Link}
        to="/catalog"
        variant="contained"
        color="primary"
        startIcon={<ArrowBackIcon />}
        sx={{ margin: theme.spacing(2) }}
      >
        Retour
      </Button>
    )
  }
  return null
}

export default BackButton
