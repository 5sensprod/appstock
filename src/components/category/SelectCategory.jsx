import React from 'react'
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'

const SelectCategory = ({
  categories,
  selectedCategoryId,
  onCategoryChange,
  parentFilter = null,
  label = 'Catégorie',
  disabled = false,
}) => {
  const filteredCategories = categories.filter((cat) => cat.parentId === null)
  return (
    <FormControl fullWidth disabled={disabled} size="small">
      <InputLabel id="category-select-label">{label}</InputLabel>
      <Select
        labelId="category-select-label"
        value={selectedCategoryId || ''}
        onChange={onCategoryChange}
        label={label}
      >
        <MenuItem value="">
          <em>
            {parentFilter ? 'Aucune sous-catégorie' : 'Toutes les catégories'}
          </em>
        </MenuItem>
        {filteredCategories.map((category) => (
          <MenuItem key={category._id} value={category._id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default SelectCategory
