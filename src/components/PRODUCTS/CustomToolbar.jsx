import React from 'react'
import {
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbar,
} from '@mui/x-data-grid-pro'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'

const CustomToolbar = ({ onAddClick, onBulkEditClick }) => (
  <GridToolbarContainer>
    <Button color="primary" startIcon={<AddIcon />} onClick={onAddClick}>
      Ajouter un produit
    </Button>

    {/* Bouton pour l'édition en masse */}
    <Button
      color="secondary"
      startIcon={<EditIcon />}
      onClick={onBulkEditClick}
    >
      Modifier en masse
    </Button>

    {/* Ajouter explicitement le QuickFilter */}
    <GridToolbarQuickFilter />

    {/* Autres éléments de la barre d'outils */}
    <GridToolbar />
  </GridToolbarContainer>
)

export default CustomToolbar
