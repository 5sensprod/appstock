import React from 'react'
import { Modal, Paper, Box } from '@mui/material'

const ReusableModal = ({ open, onClose, children, maxWidth = 600 }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Paper
          sx={{
            padding: 2,
            maxWidth: maxWidth,
            width: '100%',
            margin: '0 20px',
          }}
        >
          {children}
        </Paper>
      </Box>
    </Modal>
  )
}

export default ReusableModal
