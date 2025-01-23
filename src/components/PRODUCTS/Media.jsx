import React, { useRef, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Input,
  Card,
  CardMedia,
  Grid,
  CircularProgress,
} from '@mui/material'
import PhotoGrid from './PhotoGrid'
import PhotoDialog from './PhotoDialog'
import PhotoUpload from './PhotoUpload'
import { isValidUrl } from '../../utils/validateUtils'
import { useMedia } from './hooks/useMedia'
import { useUI } from '../../contexts/UIContext'
import { updateFeaturedImage } from '../../api/mediaService'
import { useConfig } from '../../contexts/ConfigContext'

const Media = ({ productId }) => {
  const fileInputRef = useRef()
  const { baseUrl } = useConfig()
  const { showToast } = useUI()

  const {
    photos,
    selectedPhotos,
    setSelectedPhotos,
    selectedPhoto,
    featuredImageName,
    open,
    imageUrl,
    setImageUrl,
    isLoading,
    handleOpen,
    handleClose,
    handleUpload,
    handleUploadFromUrl,
    onToggleSelect,
    handleDeleteSelected,
    newPhoto,
    setNewPhoto,
    resetSelectedFileNames,
    setFeaturedImageName,
    fetchPhotos,
    fetchFeaturedImage,
  } = useMedia(productId, baseUrl, showToast)

  // Effet pour recharger les données si productId change
  useEffect(() => {
    if (productId) {
      fetchPhotos()
      fetchFeaturedImage()
    }
  }, [productId, fetchPhotos, fetchFeaturedImage])

  console.log('Avant construction featuredImageUrl:', {
    baseUrl,
    productId,
    featuredImageName,
  })

  const featuredImageUrl = featuredImageName
    ? `${baseUrl}/catalogue/${productId}/${featuredImageName}`
    : null

  console.log('Après construction:', featuredImageUrl)

  const handleSetFeatured = async () => {
    if (selectedPhotos.length !== 1) return

    try {
      const newFeaturedImageName = selectedPhotos[0].split('/').pop()
      await updateFeaturedImage(productId, newFeaturedImageName)

      // Mise à jour immédiate de l'UI
      setFeaturedImageName(newFeaturedImageName)
      setSelectedPhotos([])
      showToast('Image mise en avant définie avec succès', 'success')

      // Recharger les données pour assurer la cohérence
      fetchPhotos()
      fetchFeaturedImage()
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de l'image mise en avant:",
        error,
      )
      showToast(
        "Erreur lors de la mise à jour de l'image mise en avant",
        'error',
      )
    }
  }

  useEffect(() => {
    console.log('FeaturedImageUrl:', featuredImageUrl)
    console.log('BaseUrl:', baseUrl)
    console.log('ProductId:', productId)
    console.log('FeaturedImageName:', featuredImageName)
  }, [featuredImageUrl])

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, mt: 5 }}>
        Ajouter des photos
      </Typography>

      <PhotoUpload
        onFilesSelect={setNewPhoto}
        onSubmit={(files) => handleUpload(files, fileInputRef)}
        fileInputRef={fileInputRef}
        resetSelectedFileNames={resetSelectedFileNames}
        showToast={showToast}
      />

      <Typography variant="h5" sx={{ mt: 2 }}>
        Ajouter via URL
      </Typography>

      <Box sx={{ mt: 2, mb: 6, display: 'flex', gap: 2 }}>
        <Input
          fullWidth
          type="text"
          placeholder="Entrez l'URL de l'image"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        {isValidUrl(imageUrl) && (
          <Button
            onClick={handleUploadFromUrl}
            variant="contained"
            color="primary"
          >
            Valider
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Image mise en avant */}
        {featuredImageUrl && (
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Image Mise en Avant
            </Typography>
            <Card>
              <CardMedia
                component="img"
                image={featuredImageUrl}
                alt="Image mise en avant"
                sx={{
                  height: 300,
                  objectFit: 'contain',
                  backgroundColor: 'background.paper',
                }}
              />
            </Card>
          </Grid>
        )}

        {/* Galerie */}
        <Grid item xs={12} md={featuredImageUrl ? 8 : 12}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Galerie
          </Typography>
          <PhotoGrid
            photos={photos}
            onPhotoClick={handleOpen}
            onToggleSelect={onToggleSelect}
            selectedPhotos={selectedPhotos}
            featuredImageName={featuredImageName}
            productId={productId}
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            {selectedPhotos.length === 1 && (
              <Button
                onClick={handleSetFeatured}
                variant="contained"
                color="primary"
              >
                Mettre en Avant
              </Button>
            )}
            {selectedPhotos.length > 0 && (
              <Button
                onClick={handleDeleteSelected}
                variant="contained"
                color="error"
              >
                Supprimer ({selectedPhotos.length})
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      <PhotoDialog open={open} photoUrl={selectedPhoto} onClose={handleClose} />
    </Box>
  )
}

export default Media
