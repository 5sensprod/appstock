import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import PhotoGrid from './PhotoGrid'
import PhotoDialog from './PhotoDialog'
import PhotoUpload from './PhotoUpload'

const Media = ({ photos, baseUrl, onAddPhoto }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [open, setOpen] = useState(false)
  const [newPhoto, setNewPhoto] = useState(null)

  const handleOpen = (photoUrl) => {
    setSelectedPhoto(photoUrl)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = () => {
    if (newPhoto) {
      onAddPhoto(newPhoto)
      setNewPhoto(null)
    }
  }

  return (
    <>
      <Typography variant="h5">Photos</Typography>
      <PhotoUpload onFileSelect={setNewPhoto} onSubmit={handleSubmit} />

      {photos && photos.length > 0 ? (
        <PhotoGrid
          photos={photos}
          baseUrl={baseUrl}
          onPhotoClick={handleOpen}
        />
      ) : (
        <Typography sx={{ m: 2 }}>Aucune photo disponible.</Typography>
      )}

      <PhotoDialog open={open} photoUrl={selectedPhoto} onClose={handleClose} />
    </>
  )
}

export default Media
