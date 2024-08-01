import React from 'react'
import { TextField } from '@mui/material'

const TextFieldWithValidation = ({
  label,
  name,
  value,
  onChange,
  error,
  helperText,
}) => {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      fullWidth
      margin="normal"
      error={!!error}
      helperText={helperText}
    />
  )
}

export default TextFieldWithValidation
