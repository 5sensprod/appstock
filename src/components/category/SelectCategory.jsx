import React from 'react'
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'

const SelectCategory = ({
  categories,
  selectedCategoryId,
  onCategoryChange,
  onFocus,
  label = 'Catégorie',
  disabled = false,
}) => {
  return (
    <FormControl fullWidth disabled={disabled} size="small">
      <InputLabel id="category-select-label">{label}</InputLabel>
      <Select
        labelId="category-select-label"
        value={selectedCategoryId || ''}
        onChange={onCategoryChange}
        onFocus={onFocus}
        label={label}
      >
        <MenuItem value="">
          <em>Toutes les catégories</em>
        </MenuItem>
        {categories
          .filter((cat) => cat.parentId === null)
          .map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  )
}

export default SelectCategory
