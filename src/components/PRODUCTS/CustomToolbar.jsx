import React from 'react'
import {
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbar,
} from '@mui/x-data-grid-pro'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'

const CustomToolbar = ({ onAddClick }) => (
  <GridToolbarContainer>
    <Button color="primary" startIcon={<AddIcon />} onClick={onAddClick}>
      Ajouter un produit
    </Button>

    {/* Ajouter explicitement le QuickFilter */}
    <GridToolbarQuickFilter />

    {/* Autres éléments de la barre d'outils */}
    <GridToolbar />
  </GridToolbarContainer>
)

export default CustomToolbar
