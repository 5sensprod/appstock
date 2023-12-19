import React from 'react'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'

const BulkEditButton = ({ isDisabled, handleOpenModal }) => {
  return (
    <IconButton
      color="primary"
      onClick={handleOpenModal}
      disabled={isDisabled}
      size="small"
    >
      <EditIcon />
    </IconButton>
  )
}

export default BulkEditButton
