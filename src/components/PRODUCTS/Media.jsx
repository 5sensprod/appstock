import React, { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import PhotoGrid from './PhotoGrid'
import PhotoDialog from './PhotoDialog'
import PhotoUpload from './PhotoUpload'
import { uploadPhoto } from '../../api/productService'

const Media = ({ productId, baseUrl, onAddPhoto }) => {
  const [photos, setPhotos] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [open, setOpen] = useState(false)
  const [newPhoto, setNewPhoto] = useState(null)

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/products/${productId}/photos`,
        )
        if (!response.ok) {
          throw new Error('Erreur de réponse du serveur')
        }
        const photoFilenames = await response.json()
        setPhotos(
          photoFilenames.map(
            (filename) => `${baseUrl}/catalogue/${productId}/${filename}`,
          ),
        )
      } catch (error) {
        console.error(
          `Erreur lors de la récupération des photos pour le produit ${productId}:`,
          error,
        )
      }
    }

    fetchPhotos()
  }, [productId, baseUrl])

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
        const formData = new FormData()
        formData.append('photo', newPhoto)

        const response = await uploadPhoto(formData, productId)
        console.log(response.message)
        setNewPhoto(null)
        onAddPhoto(response.filename)
      } catch (error) {
        console.error("Erreur lors de l'upload", error)
      }
    }
  }

  return (
    <>
      <Typography variant="h5">Photos</Typography>
      <PhotoUpload onFileSelect={setNewPhoto} onSubmit={handleUpload} />
      <PhotoGrid photos={photos} onPhotoClick={handleOpen} />
      <PhotoDialog open={open} photoUrl={selectedPhoto} onClose={handleClose} />
    </>
  )
}

export default Media
