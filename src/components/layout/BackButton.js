import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Fab from '@mui/material/Fab'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const BackButton = ({ theme }) => {
  const location = useLocation()

  const matchCreateOrEdit = location.pathname.match(
    /\/create-product|\/edit-product\/.+/,
  )

  if (matchCreateOrEdit) {
    return (
      <Fab
        component={Link}
        to="/catalog"
        color="primary"
        sx={{ margin: theme.spacing(0) }}
        size="small"
      >
        <ArrowBackIcon />
      </Fab>
    )
  }
  return null
}

export default BackButton
