import React, { useState, useEffect, useRef } from 'react'
import { Box, Typography } from '@mui/material'
import PhotoGrid from './PhotoGrid'
import PhotoDialog from './PhotoDialog'
import PhotoUpload from './PhotoUpload'
import { uploadPhoto } from '../../api/productService'
import { useUI } from '../../contexts/UIContext'

const Media = ({ productId, baseUrl }) => {
  const [photos, setPhotos] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [open, setOpen] = useState(false)
  const [newPhoto, setNewPhoto] = useState(null)
  const fileInputRef = useRef()
  const { showToast } = useUI()

  // Définissez fetchPhotos à l'extérieur des useEffect
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

  useEffect(() => {
    fetchPhotos()
  }, [productId, baseUrl])

  useEffect(() => {
    const eventSource = new EventSource(`${baseUrl}/api/events`)

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'photo-added' && data.productId === productId) {
        fetchPhotos()
      }
    }

    return () => {
      eventSource.close()
    }
  }, [productId, baseUrl])

  const handleOpen = (photoUrl) => {
    setSelectedPhoto(photoUrl)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleUpload = async () => {
    if (newPhoto && newPhoto.length > 0) {
      try {
        const formData = new FormData()
        for (const file of newPhoto) {
          formData.append('photos', file)
        }

        const uploadResult = await uploadPhoto(formData, productId)

        if (uploadResult.ok) {
          console.log(uploadResult.data.message)
          setNewPhoto(null)
          showToast('Photos téléversées avec succès.', 'success')
        } else {
          // Personnalisez le message d'erreur
          let errorMessage = "Erreur lors de l'upload des photos."
          if (
            uploadResult.errorData &&
            uploadResult.errorData.message.includes(
              'Type de fichier non autorisé',
            )
          ) {
            errorMessage =
              'Type de fichier non autorisé. Seuls les fichiers PNG, JPG, JPEG et WEBP sont acceptés.'
          }
          showToast(errorMessage, 'error')
        }
      } catch (error) {
        console.error("Erreur lors de l'upload", error)
        showToast("Erreur lors de l'upload des photos.", 'error')
      }
    }
  }

  return (
    <>
      <Typography variant="h5">Photos</Typography>
      <PhotoUpload
        onFilesSelect={setNewPhoto}
        onSubmit={handleUpload}
        fileInputRef={fileInputRef}
      />
      <PhotoGrid photos={photos} onPhotoClick={handleOpen} />
      <PhotoDialog open={open} photoUrl={selectedPhoto} onClose={handleClose} />
    </>
  )
}

export default Media
