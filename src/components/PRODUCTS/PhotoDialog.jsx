import React from 'react'
import { Dialog } from '@mui/material'

const PhotoDialog = ({ open, photoUrl, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} sx={{ mt: 4 }}>
      <img
        src={photoUrl}
        alt="Selected"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </Dialog>
  )
}

export default PhotoDialog
