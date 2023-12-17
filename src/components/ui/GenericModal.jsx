import React from 'react'
import { Modal, Box, Typography, CardMedia } from '@mui/material'

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

const GenericModal = ({ open, onClose, title, content, imageUrl }) => {
  if (!open) return null

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {imageUrl && (
          <CardMedia
            component="img"
            height="140"
            image={imageUrl}
            alt={title}
          />
        )}
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        <Box sx={{ mt: 2 }}>
          {content} {/* Directement inséré sans Typography supplémentaire */}
        </Box>
        {/* ... autres contenus génériques ... */}
      </Box>
    </Modal>
  )
}

export default GenericModal
