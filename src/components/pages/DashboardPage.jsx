import React, { useState } from 'react'
import SalesLineChart from '../charts/SalesBarChart'
import UserDetails from '../users/UserDetails'
import DateRangePicker from '../ui/DateRangePicker'

const DashboardPage = () => {
  const [selectedRange, setSelectedRange] = useState('this_month')

  const handleRangeChange = (event) => {
    setSelectedRange(event.target.value)
  }

  return (
    <div>
      <UserDetails />
      <DateRangePicker
        selectedRange={selectedRange}
        onChange={handleRangeChange}
      />
      <SalesLineChart selectedRange={selectedRange} />
    </div>
  )
}

export default DashboardPage
