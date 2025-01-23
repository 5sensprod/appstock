import { useState, useEffect, useCallback } from 'react'
import {
  uploadPhoto,
  uploadPhotoFromUrl,
  getFeaturedImage,
} from '../../../api/mediaService'

export const useMedia = (productId, baseUrl, showToast) => {
  const [photos, setPhotos] = useState([])
  const [selectedPhotos, setSelectedPhotos] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [open, setOpen] = useState(false)
  const [newPhoto, setNewPhoto] = useState([])
  const [imageUrl, setImageUrl] = useState('')
  const [featuredImageName, setFeaturedImageName] = useState(() => {
    try {
      const storedFeatured = localStorage.getItem(`featured_${productId}`)
      return storedFeatured || null
    } catch {
      return null
    }
  })
  const [isLoading, setIsLoading] = useState(true)

  const updateFeaturedImage = (newValue) => {
    setFeaturedImageName(newValue)
    if (newValue) {
      localStorage.setItem(`featured_${productId}`, newValue)
    } else {
      localStorage.removeItem(`featured_${productId}`)
    }
  }

  const fetchPhotos = useCallback(async () => {
    if (!productId) return

    try {
      const response = await fetch(
        `${baseUrl}/api/products/${productId}/photos`,
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const photoFilenames = await response.json()

      const photoUrls = Array.isArray(photoFilenames)
        ? photoFilenames.map(
            (filename) => `${baseUrl}/catalogue/${productId}/${filename}`,
          )
        : []

      setPhotos(photoUrls)
    } catch (error) {
      console.error(`Erreur lors de la récupération des photos:`, error)
      setPhotos([])
      showToast('Erreur lors du chargement des photos', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [productId, baseUrl, showToast])

  // Fonction fetchFeaturedImage avec gestion d'erreurs améliorée

  // Effet pour le chargement initial
  useEffect(() => {
    if (!productId || !baseUrl) return

    const ws = new WebSocket(`ws://${window.location.hostname}:5000`)
    let isConnected = false

    ws.onopen = () => {
      isConnected = true
      fetchPhotos()
      fetchFeaturedImage()
    }

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data)
      if (data.productId === productId) {
        await fetchPhotos()
        await fetchFeaturedImage()
      }
    }

    return () => {
      if (isConnected) ws.close()
    }
  }, [productId, baseUrl])

  // Modifier fetchFeaturedImage pour utiliser updateFeaturedImage
  const fetchFeaturedImage = useCallback(async () => {
    try {
      const response = await getFeaturedImage(productId)
      updateFeaturedImage(response.featuredImage)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }, [productId])
  const handleOpen = (photoUrl) => {
    setSelectedPhoto(photoUrl)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const resetSelectedFileNames = (fileInputRef) => {
    if (fileInputRef?.current) {
      fileInputRef.current.value = ''
      setNewPhoto([])
    }
  }
  const handleUpload = async (filesToSubmit, fileInputRef) => {
    if (filesToSubmit && filesToSubmit.length > 0) {
      try {
        const formData = new FormData()
        for (const file of filesToSubmit) {
          formData.append('photos', file)
        }

        const response = await uploadPhoto(formData, productId)

        if (response.files) {
          showToast('Image(s) ajoutée(s) avec succès', 'success')
          fetchPhotos() // Force le rechargement des photos
        }
      } catch (error) {
        console.error("Erreur lors de l'upload", error)
        showToast("Erreur lors de l'ajout de l'image", 'error')
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    }
  }
  const handleUploadFromUrl = async () => {
    if (!imageUrl) {
      showToast("Veuillez saisir une URL d'image.", 'info')
      return
    }

    try {
      await uploadPhotoFromUrl(productId, imageUrl)
      setImageUrl('')
      fetchPhotos()
      showToast('Image téléchargée avec succès.', 'success')
    } catch (error) {
      console.error(
        "Erreur lors du téléchargement de l'image depuis l'URL:",
        error,
      )
      showToast("Erreur lors du téléchargement de l'image.", 'error')
    }
  }

  const onToggleSelect = (photo) => {
    setSelectedPhotos((prevSelected) => {
      if (prevSelected.includes(photo)) {
        return prevSelected.filter((p) => p !== photo)
      } else {
        return [...prevSelected, photo]
      }
    })
  }

  const handleDeleteSelected = async () => {
    const filenamesToDelete = selectedPhotos.map((p) => p.split('/').pop())

    try {
      const response = await fetch(
        `${baseUrl}/api/products/${productId}/delete-photos`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ photosToDelete: filenamesToDelete }),
        },
      )

      if (!response.ok) throw new Error('Erreur suppression')

      // Attendre légèrement pour la propagation SSE
      await new Promise((resolve) => setTimeout(resolve, 100))
      setSelectedPhotos([])
      fetchPhotos()
      showToast('Photos supprimées', 'success')
    } catch (error) {
      showToast('Erreur suppression', 'error')
    }
  }
  return {
    photos,
    selectedPhotos,
    setSelectedPhotos,
    selectedPhoto,
    setSelectedPhoto,
    open,
    setOpen,
    newPhoto,
    setNewPhoto,
    imageUrl,
    setImageUrl,
    isLoading,
    featuredImageName,
    setFeaturedImageName,
    fetchPhotos,
    fetchFeaturedImage,
    handleOpen,
    handleClose,
    handleUpload,
    handleUploadFromUrl,
    onToggleSelect,
    handleDeleteSelected,
    resetSelectedFileNames,
  }
}
