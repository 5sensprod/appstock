import React, { useState, useEffect, useRef } from 'react'
import { Box, Typography, Button } from '@mui/material'
import PhotoGrid from './PhotoGrid'
import PhotoDialog from './PhotoDialog'
import PhotoUpload from './PhotoUpload'
import { uploadPhoto, uploadPhotoFromUrl } from '../../api/productService'

const Media = ({ productId, baseUrl }) => {
  const [photos, setPhotos] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [open, setOpen] = useState(false)
  const [newPhoto, setNewPhoto] = useState([])
  const fileInputRef = useRef()
  const [imageUrl, setImageUrl] = useState('')

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

  const resetSelectedFileNames = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUpload = async (filesToSubmit) => {
    if (filesToSubmit && filesToSubmit.length > 0) {
      try {
        const formData = new FormData()
        for (const file of filesToSubmit) {
          formData.append('photos', file)
        }

        const response = await uploadPhoto(formData, productId)
        console.log(response.message)

        if (response.files) {
          // Les fichiers ont été téléchargés avec succès, aucune action nécessaire ici
        }
      } catch (error) {
        console.error("Erreur lors de l'upload", error)
      }
    }
  }

  const handleUploadFromUrl = async () => {
    if (!imageUrl) {
      console.log("Veuillez saisir une URL d'image.")
      return
    }

    try {
      await uploadPhotoFromUrl(productId, imageUrl)
      console.log('Image téléchargée avec succès.')
      setImageUrl('')
      fetchPhotos()
    } catch (error) {
      console.error(
        "Erreur lors du téléchargement de l'image depuis l'URL:",
        error,
      )
    }
  }

  return (
    <>
      <Typography variant="h5">Photos</Typography>
      <PhotoUpload
        onFilesSelect={setNewPhoto}
        onSubmit={handleUpload}
        fileInputRef={fileInputRef}
        resetSelectedFileNames={resetSelectedFileNames}
      />
      <Box
        sx={{
          mt: 4,
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          placeholder="Entrez l'URL de l'image"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <Button
          onClick={handleUploadFromUrl}
          variant="contained"
          color="primary"
        >
          Télécharger l'image
        </Button>
      </Box>
      <PhotoGrid photos={photos} onPhotoClick={handleOpen} />
      <PhotoDialog open={open} photoUrl={selectedPhoto} onClose={handleClose} />
    </>
  )
}

export default Media
