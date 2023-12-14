import React from 'react'
import { Button } from '@mui/material'

const BulkEditButton = ({ isDisabled, handleOpenModal }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleOpenModal}
      disabled={isDisabled}
      style={{ height: '56px' }}
    >
      Modifier en Masse
    </Button>
  )
}

export default BulkEditButton
