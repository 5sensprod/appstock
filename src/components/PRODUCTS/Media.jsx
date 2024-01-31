import React, { useRef } from 'react'
import {
  Box,
  Typography,
  Button,
  Input,
  Card,
  CardMedia,
  Grid,
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
  const { showToast, showConfirmDialog } = useUI()
  const {
    photos,
    selectedPhotos,
    setSelectedPhotos,
    selectedPhoto,
    setSelectedPhoto,
    featuredImageName,
    open,
    setOpen,
    imageUrl,
    setImageUrl,
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
  } = useMedia(productId, baseUrl, showToast, showConfirmDialog)

  const featuredImageUrl = featuredImageName
    ? `${baseUrl}/catalogue/${productId}/${featuredImageName}`
    : null

  const handleSetFeatured = async () => {
    if (selectedPhotos.length === 1) {
      const featuredImageName = selectedPhotos[0].split('/').pop()
      await updateFeaturedImage(productId, featuredImageName)
      showToast('Image mise en avant définie avec succès', 'success')
      setFeaturedImageName(featuredImageName) // Mise à jour de l'état
      setSelectedPhotos([]) // Réinitialisation des photos sélectionnées
    }
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Ajouter des photos
      </Typography>
      <PhotoUpload
        onFilesSelect={setNewPhoto}
        onSubmit={(files) => handleUpload(files, fileInputRef)}
        fileInputRef={fileInputRef}
        resetSelectedFileNames={() => resetSelectedFileNames(fileInputRef)}
        showToast={showToast}
      />
      <Typography variant="h5" sx={{ mt: 2 }}>
        Ajouter via URL
      </Typography>
      <Box
        sx={{
          mt: 2,
          mb: 6,
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <Input
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
            size="small"
          >
            Valider
          </Button>
        )}
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {' '}
          {/* Contenu de gauche */}
          {featuredImageUrl && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Mise en Avant
              </Typography>
              <Card>
                <CardMedia
                  component="img"
                  image={featuredImageUrl}
                  alt="Image mise en avant"
                />
              </Card>
            </Box>
          )}
        </Grid>

        <Grid item xs={6}>
          {' '}
          {/* Contenu de droite */}
          <Box sx={{ mt: 2 }}>
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
            <Box sx={{ display: 'flex', gap: '16px', mt: 2 }}>
              {selectedPhotos.length === 1 && (
                <Button
                  onClick={handleSetFeatured}
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  Mettre en Avant
                </Button>
              )}
              {selectedPhotos.length > 0 && (
                <Button
                  onClick={handleDeleteSelected}
                  variant="contained"
                  color="error"
                  size="small"
                >
                  Supprimer
                </Button>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
      <PhotoDialog open={open} photoUrl={selectedPhoto} onClose={handleClose} />
    </>
  )
}

export default Media
