import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const HeaderPdf = ({ data, title }) => {
  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }
    return new Intl.DateTimeFormat('fr-FR', options).format(
      new Date(dateString),
    )
  }

  return (
    <>
      <Box sx={{ textAlign: 'center', mt: 1 }}>
        <Typography variant="body1" fontSize={14} sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography variant="body1" fontSize={10}>
          Numéro : {data.number}
        </Typography>
        <Typography variant="body1" fontSize={10}>
          Le {formatDate(data.date)}
        </Typography>
      </Box>
    </>
  )
}

export default HeaderPdf
