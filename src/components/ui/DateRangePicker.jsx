import React, { useState } from 'react'
import { MenuItem, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

const DateRangePicker = ({ selectedRange, onChange, onDateChange }) => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const ranges = [
    { label: 'Cette semaine', value: 'this_week' },
    { label: 'Ce mois', value: 'this_month' },
    { label: 'Ce trimestre', value: 'this_quarter' },
    { label: 'Cette année', value: 'this_year' },
    { label: 'Personnalisé', value: 'custom' },
  ]

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue)
    if (newValue && endDate) {
      onDateChange({ startDate: newValue, endDate })
    }
  }

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue)
    if (startDate && newValue) {
      onDateChange({ startDate, endDate: newValue })
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
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
      {selectedRange === 'custom' && (
        <>
          <DatePicker
            label="Date de début"
            value={startDate}
            onChange={handleStartDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="Date de fin"
            value={endDate}
            onChange={handleEndDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </>
      )}
    </LocalizationProvider>
  )
}

export default DateRangePicker
