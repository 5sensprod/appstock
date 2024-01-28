import React from 'react'
import { Box, Button } from '@mui/material'

const PhotoUpload = ({ onFileSelect, onSubmit }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <Box>
      <input type="file" onChange={handleFileChange} />
      <Button onClick={onSubmit} variant="contained" color="primary">
        Ajouter la photo
      </Button>
    </Box>
  )
}

export default PhotoUpload
