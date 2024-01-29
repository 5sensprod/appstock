import React, { useRef } from 'react'
import { Box, Typography, Button, Input } from '@mui/material'
import PhotoGrid from './PhotoGrid'
import PhotoDialog from './PhotoDialog'
import PhotoUpload from './PhotoUpload'
import { isValidUrl } from '../../utils/validateUtils'
import { useMedia } from './hooks/useMedia'
import { useUI } from '../../contexts/UIContext'

const Media = ({ productId, baseUrl }) => {
  const fileInputRef = useRef()
  const { showToast, showConfirmDialog } = useUI()
  const {
    photos,
    selectedPhotos,
    setSelectedPhotos,
    selectedPhoto,
    setSelectedPhoto,
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
  } = useMedia(productId, baseUrl, showToast, showConfirmDialog)

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
      <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
        Galerie
      </Typography>
      <PhotoGrid
        photos={photos}
        onPhotoClick={handleOpen}
        onToggleSelect={onToggleSelect}
        selectedPhotos={selectedPhotos}
      />
      {selectedPhotos.length > 0 && (
        <Button
          onClick={handleDeleteSelected}
          variant="contained"
          color="error"
          size="small"
          sx={{ mt: 4, mb: 6 }}
        >
          Supprimer la sélection
        </Button>
      )}
      <PhotoDialog open={open} photoUrl={selectedPhoto} onClose={handleClose} />
    </>
  )
}

export default Media
