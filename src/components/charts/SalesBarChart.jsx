import React, { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { getInvoices } from '../../api/invoiceService'
import moment from 'moment'

const SalesLineChart = () => {
  const [salesData, setSalesData] = useState([])

  useEffect(() => {
    const fetchAndProcessInvoices = async () => {
      const invoices = await getInvoices()

      if (Array.isArray(invoices)) {
        const salesByDate = invoices.reduce((acc, invoice) => {
          const date = moment(invoice.date).format('YYYY-MM-DD')
          if (!acc[date]) {
            acc[date] = 0
          }
          acc[date] += parseFloat(invoice.totalTTC)
          return acc
        }, {})

        const formattedData = Object.entries(salesByDate)
          .map(([date, totalSales]) => ({
            date,
            totalSales,
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date))

        setSalesData(formattedData)
      }
    }

    fetchAndProcessInvoices()
  }, [])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={salesData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) =>
            moment(value, 'YYYY-MM-DD').format('DD/MM/YYYY')
          }
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="totalSales"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default SalesLineChart
