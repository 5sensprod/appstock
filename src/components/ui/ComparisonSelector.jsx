import React, { useState, useEffect } from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'

const ComparisonSelector = ({ selectedRange, onComparisonChange }) => {
  const [comparisonOptions, setComparisonOptions] = useState([])

  useEffect(() => {
    // Déterminer les options basées sur selectedRange
    const options = {
      this_week: ['s-1', 'm-1', 't-1', 'n-1'],
      this_month: ['m-1', 't-1', 'n-1'],
      this_quarter: ['t-1', 'n-1'],
      this_year: ['n-1'],
    }

    setComparisonOptions(options[selectedRange] || [])
  }, [selectedRange])

  return (
    <FormControl fullWidth>
      <InputLabel>Période de comparaison</InputLabel>
      <Select
        value=""
        label="Période de comparaison"
        onChange={(event) => onComparisonChange(event.target.value)}
        defaultValue=""
      >
        {comparisonOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default ComparisonSelector
