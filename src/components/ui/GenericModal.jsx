import React, { useState } from 'react'
import { Tabs, Tab, Modal, Box, Typography, CardMedia } from '@mui/material'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
}

const GenericModal = ({
  open,
  onClose,
  title,
  content,
  imageUrl,
  photos,
  baseUrl = '',
}) => {
  if (!open) return null

  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="modal tabs"
          >
            <Tab label="Description" />
            <Tab label="Fiche technique" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            {React.cloneElement(content, { baseUrl: baseUrl })}
            {imageUrl && (
              <CardMedia
                component="img"
                height="140"
                image={imageUrl}
                alt={title}
              />
            )}
          </Box>
        )}

        {tabValue === 1 && <Box sx={{ p: 3 }}>{<p>Fiche technique</p>}</Box>}
      </Box>
    </Modal>
  )
}

export default GenericModal
