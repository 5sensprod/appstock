import React from 'react'
import { Box, Button } from '@mui/material'

const ProductToolbar = ({
  onCreateClick,
  onBulkEditClick,
  onExportClick,
  onGenerateCodesClick,
  hasSelection,
  hasMultipleSelection,
}) => {
  return (
    <Box mb={2} mt={1}>
      <Button variant="contained" color="primary" onClick={onCreateClick}>
        Créer un produit
      </Button>

      <Button
        variant="contained"
        color="secondary"
        onClick={onBulkEditClick}
        disabled={!hasMultipleSelection}
        style={{ marginLeft: 16 }}
      >
        Modifier en masse
      </Button>

      <Button
        variant="contained"
        color="secondary"
        onClick={onExportClick}
        disabled={!hasSelection}
        style={{ marginLeft: 16 }}
      >
        Exporter
      </Button>

      <Button
        variant="contained"
        color="secondary"
        onClick={onGenerateCodesClick}
        disabled={!hasSelection}
        style={{ marginLeft: 16 }}
      >
        Générer Codes
      </Button>
    </Box>
  )
}

export default ProductToolbar
