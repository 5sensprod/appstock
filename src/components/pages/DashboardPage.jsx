import React, { useState } from 'react'
import SalesLineChart from '../charts/SalesBarChart'
import UserDetails from '../users/UserDetails'
import DateRangePicker from '../ui/DateRangePicker'

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
    <div>
      <UserDetails />
      <DateRangePicker
        selectedRange={selectedRange}
        onChange={handleRangeChange}
        onDateChange={handleDateChange}
      />
      <SalesLineChart selectedRange={selectedRange} dateRange={dateRange} />
    </div>
  )
}

export default DashboardPage
