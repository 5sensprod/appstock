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
import { formatPrice } from '../../utils/priceUtils'

const SalesLineChart = ({ selectedRange, dateRange }) => {
  const [salesData, setSalesData] = useState([])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dateStr = moment(payload[0].payload.date).format('DD/MM/YYYY')
      return (
        <div
          style={{
            backgroundColor: '#fff',
            padding: '5px',
            border: '1px solid #ccc',
          }}
        >
          <p>{dateStr}</p>
          <p>C.A TTC : {formatPrice(payload[0].value)}</p>
        </div>
      )
    }

    return null
  }
  const convertRangeToDate = (range) => {
    if (range === 'custom' && dateRange.startDate && dateRange.endDate) {
      return {
        startDate: moment(dateRange.startDate).toISOString(),
        endDate: moment(dateRange.endDate).toISOString(),
      }
    }
    switch (range) {
      case 'this_week':
        return {
          startDate: moment().startOf('week').toISOString(),
          endDate: moment().endOf('week').toISOString(),
        }
      case 'this_month':
        return {
          startDate: moment().startOf('month').toISOString(),
          endDate: moment().endOf('month').toISOString(),
        }
      case 'this_quarter':
        return {
          startDate: moment().startOf('quarter').toISOString(),
          endDate: moment().endOf('quarter').toISOString(),
        }
      case 'this_year':
        return {
          startDate: moment().startOf('year').toISOString(),
          endDate: moment().endOf('year').toISOString(),
        }
      default:
        return {
          startDate: '2024-01-01T00:00:00.000Z',
          endDate: '2024-12-31T23:59:59.999Z',
        }
    }
  }

  useEffect(() => {
    const fetchAndProcessInvoices = async () => {
      const { startDate, endDate } = convertRangeToDate(selectedRange)
      const invoices = await getInvoices(startDate, endDate)

      const filteredInvoices = invoices.filter((invoice) => {
        const invoiceDate = moment(invoice.date)
        return invoiceDate.isBetween(startDate, endDate, null, '[]')
      })

      const salesByDate = filteredInvoices.reduce((acc, invoice) => {
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

    fetchAndProcessInvoices()
  }, [selectedRange, dateRange])

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
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="totalSales"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          legendType="none"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default SalesLineChart
