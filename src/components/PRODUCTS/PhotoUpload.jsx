import React from 'react'
import { Box, Button } from '@mui/material'

const PhotoUpload = ({ onFilesSelect, onSubmit }) => {
  const handleFileChange = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      onFilesSelect(files)
    }
  }

  return (
    <Box>
      <input type="file" multiple onChange={handleFileChange} />
      <Button onClick={onSubmit} variant="contained" color="primary">
        Ajouter les photos
      </Button>
    </Box>
  )
}

export default PhotoUpload
