import React from 'react'
import { Modal, Paper, Box } from '@mui/material'

const ReusableModal = ({ open, onClose, children, maxWidth = 600 }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Paper style={{ margin: 'auto', padding: 20, maxWidth }}>
        <Box>{children}</Box>
      </Paper>
    </Modal>
  )
}

export default ReusableModal
