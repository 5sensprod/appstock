import React, { forwardRef } from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'

const CustomSelect = forwardRef(
  ({ label, options, onChange, value, ...props }, ref) => {
    return (
      <FormControl fullWidth margin="normal">
        <InputLabel>{label}</InputLabel>
        <Select
          ref={ref}
          value={value}
          onChange={onChange}
          label={label}
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
