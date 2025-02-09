// src/api/quoteService.js
import { fetchApi } from './axiosConfig'

// Obtenir tous les devis
export const getQuotes = async () => {
  try {
    const url = 'quotes' // Utilisez l'URL relative de votre endpoint API
    return await fetchApi(url)
  } catch (error) {
    console.error('Erreur lors de la récupération des devis:', error)
    throw error // Il est généralement mieux de renvoyer l'erreur pour une gestion plus fine
  }
}

// Ajouter un nouveau devis
export const addQuote = async (quoteData) => {
  try {
    const url = 'quotes'
    return await fetchApi(url, 'POST', quoteData)
  } catch (error) {
    console.error("Erreur lors de l'ajout du devis:", error)
    throw error
  }
}

// Mettre à jour un devis
export const updateQuote = async (id, quoteData) => {
  try {
    const url = `quotes/${id}`
    return await fetchApi(url, 'PUT', quoteData)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du devis:', error)
    throw error
  }
}

// Supprimer un devis
export const deleteQuote = async (id) => {
  try {
    const url = `quotes/${id}`
    return await fetchApi(url, 'DELETE')
  } catch (error) {
    console.error('Erreur lors de la suppression du devis:', error)
    throw error
  }
}

// Ajout de la fonction pour récupérer les détails d'un devis par son ID
export const getQuoteDetailsById = async (id) => {
  try {
    const url = `quotes/${id}`
    const response = await fetchApi(url)
    return response
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du devis:', error)
    throw error
  }
}
