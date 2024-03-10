import React from 'react'
import { Typography } from '@mui/material'

const HeaderPdf = ({
  data,
  title,
  titleFontSize = '14px',
  numberFontSize = '10px',
  dateFontSize = '10px',
}) => {
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
      <Typography
        variant="body1"
        sx={{ fontSize: titleFontSize, fontWeight: 'bold' }}
      >
        {title}
      </Typography>
      <Typography variant="body1" sx={{ fontSize: numberFontSize }}>
        Numéro : {data.number || data.quoteNumber}
      </Typography>
      <Typography variant="body1" sx={{ fontSize: dateFontSize }}>
        Le {formatDate(data.date)}
      </Typography>
    </>
  )
}

export default HeaderPdf
