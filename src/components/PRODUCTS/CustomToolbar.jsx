import React, { useState } from 'react'
import {
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
} from '@mui/x-data-grid-pro'
import { IconButton, Menu, MenuItem, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DensityMediumIcon from '@mui/icons-material/DensityMedium'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useGridPreferences } from '../../contexts/GridPreferenceContext'

const CustomToolbar = ({ onAddClick, onBulkEditClick }) => {
  const { gridPreferences, updatePreferences } = useGridPreferences()
  const currentDensity = gridPreferences.density

  const [anchorEl, setAnchorEl] = useState(null)

  const handleDensityMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDensityChange = (density) => {
    setAnchorEl(null)
    updatePreferences({ density })
  }

  return (
    <GridToolbarContainer>
      <IconButton color="primary" onClick={onAddClick}>
        <AddIcon />
      </IconButton>

      <IconButton color="secondary" onClick={onBulkEditClick}>
        <EditIcon fontSize="small" />
      </IconButton>

      <IconButton
        color="primary"
        onClick={handleDensityMenuClick}
        // style={{ marginLeft: 'auto' }}
      >
        <VisibilityIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => handleDensityChange('compact')}
          selected={currentDensity === 'compact'}
        >
          <Typography variant="inherit" style={{ fontSize: '0.875rem' }}>
            Compact
          </Typography>{' '}
        </MenuItem>
        <MenuItem
          onClick={() => handleDensityChange('standard')}
          selected={currentDensity === 'standard'}
        >
          <Typography variant="inherit" style={{ fontSize: '0.875rem' }}>
            Standard
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => handleDensityChange('comfortable')}
          selected={currentDensity === 'comfortable'}
        >
          <Typography variant="inherit" style={{ fontSize: '0.875rem' }}>
            Confortable
          </Typography>
        </MenuItem>
      </Menu>

      <GridToolbarQuickFilter />

      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport />

      {/* IconButton pour le sélecteur de densité */}
    </GridToolbarContainer>
  )
}

export default CustomToolbar
