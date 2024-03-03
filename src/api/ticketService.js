// src/api/ticketService.js
import { fetchApi } from './axiosConfig'

export const getTickets = async (startDate, endDate) => {
  try {
    const url = `tickets?startDate=${startDate}&endDate=${endDate}`
    return await fetchApi(url)
  } catch (error) {
    console.error('Erreur lors de la récupération des tickets:', error)
    return []
  }
}

export const addTicket = async (ticketData) => {
  try {
    return await fetchApi('tickets', 'POST', ticketData)
  } catch (error) {
    console.error("Erreur lors de l'ajout du ticket:", error)
    throw error
  }
}

export const updateTicket = async (id, ticketData) => {
  try {
    return await fetchApi(`tickets/${id}`, 'PUT', ticketData)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du ticket:', error)
    throw error
  }
}

export const deleteTicket = async (id) => {
  try {
    return await fetchApi(`tickets/${id}`, 'DELETE')
  } catch (error) {
    console.error('Erreur lors de la suppression du ticket:', error)
    throw error
  }
}

export const incrementPdfGenerationCount = async (id) => {
  try {
    const response = await fetchApi(
      `tickets/incrementPdfGeneration/${id}`,
      'PUT',
    )
    if (response.status === 200) {
      console.log('Compteur de génération PDF mis à jour avec succès.')
    } else {
      console.error(
        "Erreur lors de l'incrément du compteur de génération de PDF.",
      )
    }
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API:", error)
    throw error
  }
}
