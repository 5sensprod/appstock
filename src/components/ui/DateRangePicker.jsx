import React, { useState } from 'react'
import { Box, MenuItem, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment'
import 'moment/locale/fr'

const DateRangePicker = ({ selectedRange, onChange, onDateChange }) => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  moment.locale('fr')

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
      <Box my={2}>
        <TextField
          select
          label="Période"
          value={selectedRange}
          onChange={onChange}
          // fullWidth
          style={{ width: '258px' }}
        >
          {ranges.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      {selectedRange === 'custom' && (
        <Box display="flex" alignItems="center" gap={2} mt={2}>
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
        </Box>
      )}
    </LocalizationProvider>
  )
}

export default DateRangePicker
