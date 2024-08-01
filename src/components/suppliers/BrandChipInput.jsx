import React from 'react'
import { Box, TextField, IconButton, Chip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

const BrandChipInput = ({
  newBrand,
  setNewBrand,
  handleAddBrand,
  handleRemoveBrand,
  brands,
}) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
        <TextField
          label="Ajouter une marque"
          value={newBrand}
          onChange={(e) => setNewBrand(e.target.value)}
          fullWidth
          margin="normal"
        />
        <IconButton onClick={handleAddBrand}>
          <AddIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 2 }}>
        {brands.map((brand, index) => (
          <Chip
            key={index}
            label={brand}
            onDelete={() => handleRemoveBrand(index)}
          />
        ))}
      </Box>
    </>
  )
}

export default BrandChipInput
