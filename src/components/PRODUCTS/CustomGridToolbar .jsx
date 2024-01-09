import React from 'react'
import ProductSearch from './ProductSearch'
import { GridToolbarContainer } from '@mui/x-data-grid-pro'

const CustomGridToolbar = () => {
  return (
    <GridToolbarContainer>
      <ProductSearch />
      {/* Autres éléments de la barre d'outils, si nécessaire */}
    </GridToolbarContainer>
  )
}

export default CustomGridToolbar
