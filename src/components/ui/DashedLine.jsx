import React from 'react'
import Box from '@mui/material/Box'

const DashedLine = () => {
  return (
    <Box
      sx={{
        border: 0,
        borderBottom: '1px dashed #000',
        width: '100%',
        margin: '8px 0',
      }}
    />
  )
}

export default DashedLine
