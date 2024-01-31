// src/components/ui/GenericModal.jsx
import React from 'react'
import { Modal, Box, Tabs, Tab } from '@mui/material'

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
  tabValue,
  setTabValue,
}) => {
  if (!open) return null

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
        <Box sx={{ p: 3 }}>{content}</Box>
      </Box>
    </Modal>
  )
}

export default GenericModal
