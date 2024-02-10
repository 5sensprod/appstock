import React, { useState } from 'react'
// Import Box from Material-UI
import Box from '@mui/material/Box' // ou '@material-ui/core/Box' pour les versions plus anciennes
import SalesLineChart from '../charts/SalesBarChart'
import UserDetails from '../users/UserDetails'
import DateRangePicker from '../ui/DateRangePicker'
import Typography from '@mui/material/Typography'
import QuoteGrid from '../quote/QuoteGrid'

const DashboardPage = () => {
  const [selectedRange, setSelectedRange] = useState('this_month')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })

  const handleRangeChange = (event) => {
    setSelectedRange(event.target.value)
  }

  const handleDateChange = ({ startDate, endDate }) => {
    setDateRange({ startDate, endDate })
  }

  return (
    <Box>
      <Box mb={4}>
        <UserDetails />
      </Box>
      <Box my={2}>
        <Typography
          variant="h5"
          component="h2"
          style={{ textTransform: 'uppercase' }}
        >
          Les ventes
        </Typography>
      </Box>
      <Box my={2}>
        <DateRangePicker
          selectedRange={selectedRange}
          onChange={handleRangeChange}
          onDateChange={handleDateChange}
        />
      </Box>

      <Box my={2}>
        <SalesLineChart selectedRange={selectedRange} dateRange={dateRange} />
      </Box>
      <Box my={2}>
        <Typography
          variant="h5"
          component="h2"
          style={{ textTransform: 'uppercase' }}
        >
          Les devis
        </Typography>
        <Box my={2}>
          <QuoteGrid />
        </Box>
      </Box>
    </Box>
  )
}

export default DashboardPage
