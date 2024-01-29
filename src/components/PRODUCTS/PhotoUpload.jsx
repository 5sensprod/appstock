import React from 'react'
import { Box, Button } from '@mui/material'

const PhotoUpload = ({ onFilesSelect, onSubmit, fileInputRef }) => {
  const handleFileChange = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      onFilesSelect(files)
    }
  }

  return (
    <Box>
      <input
        type="file"
        multiple
        accept=".png,.jpg,.jpeg,.webp" // Accepter seulement ces formats
        onChange={handleFileChange}
      />
      <Button onClick={onSubmit} variant="contained" color="primary">
        Ajouter les photos
      </Button>
    </Box>
  )
}

export default PhotoUpload
