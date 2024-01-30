import { useState, useEffect } from 'react'
import {
  uploadPhoto,
  uploadPhotoFromUrl,
  getFeaturedImage,
} from '../../../api/productService'

export const useMedia = (productId, baseUrl, showToast) => {
  const [photos, setPhotos] = useState([])
  const [selectedPhotos, setSelectedPhotos] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [open, setOpen] = useState(false)
  const [newPhoto, setNewPhoto] = useState([])
  const [imageUrl, setImageUrl] = useState('')
  const [featuredImageName, setFeaturedImageName] = useState(null)

  useEffect(() => {
    fetchPhotos()
    fetchFeaturedImage()
  }, [productId, baseUrl])

  const fetchFeaturedImage = async () => {
    try {
      const response = await getFeaturedImage(productId)
      if (response && response.featuredImage) {
        setFeaturedImageName(response.featuredImage)
      }
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de l'image mise en avant pour le produit ${productId}:`,
        error,
      )
    }
  }

  useEffect(() => {
    const eventSource = new EventSource(`${baseUrl}/api/events`)
    console.log('Event Source URL useMedia:', eventSource)

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === 'photo-added' && data.productId === productId) {
        fetchPhotos()
      }

      // Ajouter la gestion pour les événements de mise à jour de l'image mise en avant
      if (
        data.type === 'featured-image-updated' &&
        data.productId === productId
      ) {
        setFeaturedImageName(data.featuredImage)
        console.log(
          'Featured image updated for product:',
          data.productId,
          'with image:',
          data.featuredImage,
        ) // Ajouter ce log pour la vérification
      }
    }

    return () => {
      eventSource.close()
    }
  }, [productId, baseUrl, setFeaturedImageName])

  const fetchPhotos = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/products/${productId}/photos`,
      )
      if (!response.ok) {
        throw new Error('Erreur de réponse du serveur')
      }
      const photoFilenames = await response.json()

      // Vérifiez que la réponse est bien un tableau
      if (!Array.isArray(photoFilenames)) {
        console.error('Format de données inattendu:', photoFilenames)
        return
      }

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

  const handleOpen = (photoUrl) => {
    setSelectedPhoto(photoUrl)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const resetSelectedFileNames = (fileInputRef) => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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

        // Afficher un toast en cas de succès
        if (response.files) {
          showToast('Image(s) ajoutée(s) avec succès', 'success')
        }
      } catch (error) {
        console.error("Erreur lors de l'upload", error)
        showToast("Erreur lors de l'ajout de l'image", 'error')
      } finally {
        // Réinitialiser fileInputRef après le téléchargement
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
    const filenamesToDelete = selectedPhotos.map((photo) =>
      photo.split('/').pop(),
    )

    try {
      const response = await fetch(
        `${baseUrl}/api/products/${productId}/delete-photos`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ photosToDelete: filenamesToDelete }),
        },
      )

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression des photos')
      }

      // Mise à jour de l'état après la suppression réussie
      setSelectedPhotos([])
      fetchPhotos()
      showToast('Photo(s) supprimée(s) avec succès', 'success')
    } catch (error) {
      console.error('Erreur lors de la suppression des photos:', error)
      showToast('Erreur lors de la suppression des images', 'error')
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
    fetchPhotos,
    handleOpen,
    handleClose,
    resetSelectedFileNames,
    handleUpload,
    handleUploadFromUrl,
    onToggleSelect,
    handleDeleteSelected,
    featuredImageName,
    setFeaturedImageName,
  }
}