import React from 'react'
import Button from '@mui/material/Button'

const NoMatchButton = ({ show, buttonText, onClick }) => {
  if (!show) {
    return null
  }

  return (
    <Button variant="contained" color="primary" onClick={onClick}>
      {buttonText}
    </Button>
  )
}

export default NoMatchButton
