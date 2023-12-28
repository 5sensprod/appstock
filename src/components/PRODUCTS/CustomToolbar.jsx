import React from 'react'
import { GridToolbar } from '@mui/x-data-grid-pro'
import { Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

const CustomToolbar = ({ onAddClick }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        color="primary"
        onClick={onAddClick}
      >
        Ajouter
      </Button>
      <GridToolbar />
    </div>
  )
}

export default CustomToolbar
