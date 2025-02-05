import React, { useState } from 'react'
import Box from '@mui/material/Box'
import SalesLineChart from '../charts/SalesBarChart'
import UserDetails from '../users/UserDetails'
import DateRangePicker from '../ui/DateRangePicker'
import Typography from '@mui/material/Typography'
import QuoteGrid from '../quote/QuoteGrid'
import ShadowBox from '../ui/ShadowBox'
import { isRunningInElectron } from '../../utils/environmentUtils'

const DashboardPage = () => {
  const [selectedRange, setSelectedRange] = useState('custom')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })

  const handleRangeChange = (event) => {
    setSelectedRange(event.target.value)
  }

  const handleDateChange = ({ startDate, endDate }) => {
    setDateRange({ startDate, endDate })
  }

  return (
    <Box>
      <Box mb={4} width="fit-content">
        <ShadowBox>
          <UserDetails />
        </ShadowBox>
      </Box>

      <Box my={2}>
        <Typography variant="h5" component="h2" className="uppercase">
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

      <Box my={2} maxWidth={853}>
        <SalesLineChart selectedRange={selectedRange} dateRange={dateRange} />
      </Box>

      <Box id="les-devis" my={2}>
        <Typography
          variant="h5"
          component="h2"
          id="les-devis"
          className="uppercase"
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
