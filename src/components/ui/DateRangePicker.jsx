import React from 'react'
import { MenuItem, TextField } from '@mui/material'

const DateRangePicker = ({ selectedRange, onChange }) => {
  const ranges = [
    { label: 'Cette semaine', value: 'this_week' },
    { label: 'Ce mois', value: 'this_month' },
    { label: 'Ce trimestre', value: 'this_quarter' },
    { label: 'Cette année', value: 'this_year' },
    { label: 'Personnalisé', value: 'custom' },
  ]

  return (
    <TextField
      select
      label="Période"
      value={selectedRange}
      onChange={onChange}
      fullWidth
    >
      {ranges.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}

export default DateRangePicker
