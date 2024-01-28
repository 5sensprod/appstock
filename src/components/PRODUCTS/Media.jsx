import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import PhotoGrid from './PhotoGrid'
import PhotoDialog from './PhotoDialog'
import PhotoUpload from './PhotoUpload'
import { uploadPhoto } from '../../api/productService'

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

  const handleUpload = async () => {
    if (newPhoto) {
      try {
        // Créez un FormData et ajoutez le fichier
        const formData = new FormData()
        formData.append('photo', newPhoto)

        // Appelez la fonction d'upload et passez le FormData
        const response = await uploadPhoto(formData)

        // Gérez la réponse
        console.log(response.message)
        setNewPhoto(null)
        onAddPhoto(response.filename) // Mettez à jour la liste des photos
      } catch (error) {
        console.error("Erreur lors de l'upload", error)
      }
    }
  }
  return (
    <>
      <Typography variant="h5">Photos</Typography>
      <PhotoUpload onFileSelect={setNewPhoto} onSubmit={handleUpload} />

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
