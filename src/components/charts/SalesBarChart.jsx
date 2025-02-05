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
import { useInvoices } from '../../contexts/InvoicesContext'
import moment from 'moment'
import { formatPrice } from '../../utils/priceUtils'

const SalesLineChart = ({ selectedRange, dateRange }) => {
  const [salesData, setSalesData] = useState([])
  const { invoices, tickets } = useInvoices()

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dateStr = moment(payload[0].payload.date).format('DD/MM/YYYY')
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow">
          <p className="text-sm font-medium">{dateStr}</p>
          <p className="text-sm">C.A TTC : {formatPrice(payload[0].value)}</p>
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
    const processSalesData = () => {
      const { startDate, endDate } = convertRangeToDate(selectedRange)

      const allDocuments = [...invoices, ...tickets].filter((doc) => {
        const docDate = moment(doc.date)
        return docDate.isBetween(startDate, endDate, null, '[]')
      })

      const salesByDate = allDocuments.reduce((acc, doc) => {
        const date = moment(doc.date).format('YYYY-MM-DD')
        if (!acc[date]) {
          acc[date] = 0
        }
        acc[date] += parseFloat(doc.totalTTC)
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

    processSalesData()
  }, [invoices, tickets, selectedRange, dateRange])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={salesData}
        margin={{
          top: 20,
          right: 30,
          left: -10,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) =>
            moment(value, 'YYYY-MM-DD').format('DD/MM/YYYY')
          }
          height={60}
          tick={{ dy: 10 }}
        />
        <YAxis width={80} tickFormatter={(value) => formatPrice(value)} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="totalSales"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          name="Chiffre d'affaires"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default SalesLineChart
