import React, { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'

const PhotoUpload = ({
  onFilesSelect,
  onSubmit,
  fileInputRef,
  resetSelectedFileNames,
}) => {
  const [selectedFileNames, setSelectedFileNames] = useState([])
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFiles = (files) => {
    const newFiles = Array.from(files)
    onFilesSelect((prevFiles) => [...prevFiles, ...newFiles])
    setSelectedFileNames((prevNames) => [
      ...prevNames,
      ...newFiles.map((file) => file.name),
    ])
  }

  const handleFileChange = (e) => {
    handleFiles(e.target.files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
    setIsDragOver(false)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleSubmit = () => {
    onSubmit()
    setSelectedFileNames([])
    resetSelectedFileNames()
  }

  return (
    <Box
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      style={{
        border: '1px dashed gray',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: isDragOver ? '#f0f0f0' : 'transparent',
      }}
    >
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        ref={fileInputRef}
        accept=".png,.jpg,.jpeg,.webp"
        style={{ display: 'none' }}
      />
      <Button
        onClick={() => fileInputRef.current.click()}
        variant="contained"
        color="primary"
      >
        Sélectionner les fichiers
      </Button>
      <p>ou glissez-déposez les fichiers ici</p>
      <Typography variant="caption" display="block" gutterBottom>
        {selectedFileNames.join(', ')}
      </Typography>
      <Button onClick={handleSubmit} variant="contained" color="primary">
        Ajouter les photos
      </Button>
    </Box>
  )
}

export default PhotoUpload
