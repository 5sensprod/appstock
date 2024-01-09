import React, { useState, useEffect } from 'react'
import { LineChart } from '@mui/x-charts'
import { getInvoices } from '../../api/invoiceService'
import moment from 'moment'

const SalesLineChart = () => {
  const [salesData, setSalesData] = useState([])

  useEffect(() => {
    const fetchAndProcessInvoices = async () => {
      const invoices = await getInvoices()
      console.log('Invoices:', invoices) // Log des factures reçues

      if (Array.isArray(invoices)) {
        const salesByDate = invoices.reduce((acc, invoice) => {
          const date = moment(invoice.date).format('DD/MM/YYYY')
          if (!acc[date]) {
            acc[date] = 0
          }
          acc[date] += parseFloat(invoice.totalTTC)
          return acc
        }, {})

        const formattedData = Object.keys(salesByDate).map((date) => ({
          date,
          totalSales: salesByDate[date],
        }))

        console.log('Formatted Data:', formattedData) // Log des données formatées
        setSalesData(formattedData)
      }
    }

    fetchAndProcessInvoices()
  }, [])

  // Préparation des données pour les axes X et Y
  const xAxisData = salesData.map((_, index) => index)
  const yAxisData = salesData.map((item) => item.totalSales)

  console.log('X Axis Data:', xAxisData) // Log des données de l'axe X
  console.log('Y Axis Data:', yAxisData) // Log des données de l'axe Y

  return (
    <LineChart
      xAxis={[
        {
          data: xAxisData,
          scaleType: 'time', // Ajout de scaleType ici
          valueFormatter: (value) =>
            salesData[value] ? salesData[value].date : '',
        },
      ]}
      yAxis={[{ id: 'totalSalesAxis', scaleType: 'linear' }]}
      series={[
        {
          yAxisKey: 'totalSalesAxis',
          data: salesData.map((item) => item.totalSales),
          label: 'Total Sales',
        },
      ]}
      height={400}
    />
  )
}

export default SalesLineChart
