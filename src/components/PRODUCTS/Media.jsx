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

        const response = await uploadPhoto(formData, productId)
        console.log(response.message)

        if (response.files) {
          setNewPhoto(null)
          // Ici, vous pouvez mettre à jour l'état avec les nouvelles photos
          // SSE devrait prendre le relais pour l'affichage
        }
      } catch (error) {
        // Ici, gérez l'erreur proprement
        console.error("Erreur lors de l'upload", error)
      }
    }
  }

  const handleFilesSelect = (files) => {
    setNewPhoto(files) // `files` est un tableau de fichiers
  }

  return (
    <>
      <Typography variant="h5">Photos</Typography>
      <PhotoUpload onFilesSelect={handleFilesSelect} onSubmit={handleUpload} />
      <PhotoGrid photos={photos} onPhotoClick={handleOpen} />
      <PhotoDialog open={open} photoUrl={selectedPhoto} onClose={handleClose} />
    </>
  )
}

export default Media
