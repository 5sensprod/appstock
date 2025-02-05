import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import SalesLineChart from '../charts/SalesBarChart'
import UserDetails from '../users/UserDetails'
import DateRangePicker from '../ui/DateRangePicker'
import Typography from '@mui/material/Typography'
import QuoteGrid from '../quote/QuoteGrid'
import ShadowBox from '../ui/ShadowBox'
import { isRunningInElectron } from '../../utils/environmentUtils'
import { getLocalIp } from '../../ipcHelper'
import { Card, CardContent, Grid } from '@mui/material'
import { Info } from '@mui/icons-material'

const DashboardPage = () => {
  const [selectedRange, setSelectedRange] = useState('custom')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })
  const [serverUrl, setServerUrl] = useState('')
  const isElectron = isRunningInElectron()

  useEffect(() => {
    const fetchUrl = async () => {
      if (isElectron) {
        const ip = await getLocalIp()
        setServerUrl(`http://${ip}:5000`)
      }
    }
    fetchUrl()
  }, [isElectron])

  const handleRangeChange = (event) => {
    setSelectedRange(event.target.value)
  }

  const handleDateChange = ({ startDate, endDate }) => {
    setDateRange({ startDate, endDate })
  }

  return (
    <Box>
      <Grid container spacing={2} mb={4}>
        <Grid item xs={isElectron ? 6 : 12}>
          <ShadowBox>
            <UserDetails />
          </ShadowBox>
        </Grid>
        {isElectron && (
          <Grid item xs={6}>
            <Card sx={{ height: '100%', bgcolor: '#f5f5f5' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Info color="primary" />
                  <Typography variant="h6">Accès Web AppStock</Typography>
                </Box>
                <Typography paragraph>
                  Vous pouvez accéder à AppStock depuis n'importe quel
                  navigateur sur votre réseau local à l'adresse :
                </Typography>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ wordBreak: 'break-all' }}
                >
                  {serverUrl || 'Chargement...'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
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
