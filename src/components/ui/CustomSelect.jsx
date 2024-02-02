import React, { forwardRef } from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'

const CustomSelect = forwardRef(
  (
    { label, options, onChange, value = '', showLabel = true, ...props },
    ref,
  ) => {
    return (
      <FormControl fullWidth margin="normal">
        {showLabel && <InputLabel>{label}</InputLabel>}
        <Select
          ref={ref}
          value={value}
          onChange={onChange}
          label={label}
          displayEmpty
          {...props}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  },
)

export default CustomSelect
