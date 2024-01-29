import React, { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ClearIcon from '@mui/icons-material/Clear'
import IconButton from '@mui/material/IconButton'

const PhotoUpload = ({
  onFilesSelect,
  onSubmit,
  fileInputRef,
  resetSelectedFileNames,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFiles = (files) => {
    const newFiles = Array.from(files)
    onFilesSelect((prevFiles) => [...prevFiles, ...newFiles])

    const filesWithButtons = newFiles.map((file) => ({
      file,
      name: file.name,
      id: Math.random().toString(36).substring(7),
    }))

    setSelectedFiles((prevSelectedFiles) => [
      ...prevSelectedFiles,
      ...filesWithButtons,
    ])
  }

  const handleFileChange = (e) => {
    handleFiles(e.target.files)
  }

  const handleDeleteFile = (id) => {
    setSelectedFiles((prevSelectedFiles) =>
      prevSelectedFiles.filter((file) => file.id !== id),
    )
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
    const filesToSubmit = selectedFiles.map((file) => file.file)
    onSubmit(filesToSubmit)
    setSelectedFiles([])
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
        backgroundColor: isDragOver ? '#f0f0f0' : 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Button
        onClick={() => fileInputRef.current.click()}
        variant="contained"
        color="primary"
        size="small"
      >
        Sélectionner les fichiers
      </Button>
      <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
        ou glissez-déposez les fichiers ici
      </Typography>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        ref={fileInputRef}
        accept=".png,.jpg,.jpeg,.webp"
        style={{ display: 'none' }}
      />
      <Box sx={{ textAlign: 'left', width: '100%', mb: 2 }}>
        {selectedFiles.map((file) => (
          <div key={file.id}>
            {file.name.length > 40
              ? file.name.substring(0, 40) + '...'
              : file.name}{' '}
            <IconButton
              color="error"
              aria-label="Supprimer"
              onClick={() => handleDeleteFile(file.id)}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </div>
        ))}
      </Box>

      {selectedFiles.length > 0 && (
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="success"
          size="small"
        >
          Ajouter
        </Button>
      )}
    </Box>
  )
}

export default PhotoUpload
