import React, { useState } from 'react'
import Box from '@mui/material/Box'
import SalesLineChart from '../charts/SalesBarChart'
import UserDetails from '../users/UserDetails'
import DateRangePicker from '../ui/DateRangePicker'
import Typography from '@mui/material/Typography'
import QuoteGrid from '../quote/QuoteGrid'
import ShadowBox from '../ui/ShadowBox'
import SerialPortSelector from '../SerialPortSelector'
import { isRunningInElectron } from '../../utils/environmentUtils' // Import de la fonction utilitaire

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
      <Box mb={4} width={'fit-content'}>
        <ShadowBox>
          <UserDetails />
        </ShadowBox>
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

      <Box my={2} maxWidth={853}>
        <SalesLineChart selectedRange={selectedRange} dateRange={dateRange} />
      </Box>

      {/* Afficher le SerialPortSelector uniquement dans Electron */}
      {isRunningInElectron() && (
        <Box my={2} maxWidth={853}>
          <SerialPortSelector />
        </Box>
      )}

      <Box id="les-devis" my={2}>
        <Typography
          variant="h5"
          component="h2"
          id="les-devis"
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
