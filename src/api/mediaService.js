import { fetchApi } from './axiosConfig'

async function getFeaturedImage(productId) {
  try {
    const response = await fetchApi(
      `products/${productId}/featuredImage`,
      'GET',
    )
    return response // Retourner la réponse qui doit contenir le nom de l'image mise en avant
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'image mise en avant:",
      error,
    )
    throw error
  }
}

async function updateFeaturedImage(productId, featuredImageName) {
  try {
    const response = await fetchApi(
      `products/${productId}/updateFeaturedImage`,
      'POST',
      { featuredImage: featuredImageName },
    )

    return response
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de l'image mise en avant:",
      error,
    )
    throw error
  }
}

async function uploadPhoto(formData, productId) {
  try {
    const response = await fetchApi(
      `products/${productId}/upload`,
      'POST',
      formData,
    )

    // Log la réponse complète du serveur
    console.log('Réponse du serveur:', response)

    // Si la réponse est un succès, retournez la réponse
    if (response.message === 'Fichiers uploadés avec succès') {
      return response
    } else {
      // Si la réponse contient un autre message, il y a eu un problème
      throw new Error(
        response.message || 'Problème lors de l’upload du fichier',
      )
    }
  } catch (error) {
    console.error("Erreur lors de l'upload de la photo:", error)
    throw error
  }
}

async function uploadPhotoFromUrl(productId, imageUrl) {
  try {
    const response = await fetchApi(
      `products/${productId}/upload-url`,
      'POST',
      { imageUrl },
    )

    return response
  } catch (error) {
    console.error(
      "Erreur lors du téléchargement de l'image depuis l'URL:",
      error,
    )
    throw error
  }
}

async function deletePhotos(baseUrl, productId, photosToDelete) {
  try {
    const response = await fetch(
      `${baseUrl}/api/products/${productId}/delete-photos`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photosToDelete }),
      },
    )

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression des photos')
    }

    return await response.json() // ou simplement return si vous n'avez pas besoin des données de réponse
  } catch (error) {
    console.error('Erreur lors de la suppression des photos:', error)
    throw error // Propager l'erreur pour la gérer dans le composant appelant
  }
}

export {
  deletePhotos,
  getFeaturedImage,
  updateFeaturedImage,
  uploadPhoto,
  uploadPhotoFromUrl,
}
