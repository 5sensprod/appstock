import { fetchApi } from './axiosConfig'

export const getInvoices = async (startDate, endDate) => {
  try {
    const url = `invoices?startDate=${startDate}&endDate=${endDate}`
    return await fetchApi(url)
  } catch (error) {
    console.error('Erreur lors de la récupération des factures:', error)
    return []
  }
}

export const addInvoice = async (invoiceData) => {
  try {
    return await fetchApi('invoices', 'POST', invoiceData)
  } catch (error) {
    console.error("Erreur lors de l'ajout de la facture:", error)
    throw error
  }
}

export const updateInvoice = async (id, invoiceData) => {
  try {
    return await fetchApi(`invoices/${id}`, 'PUT', invoiceData)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la facture:', error)
    throw error
  }
}

export const deleteInvoice = async (id) => {
  try {
    return await fetchApi(`invoices/${id}`, 'DELETE')
  } catch (error) {
    console.error('Erreur lors de la suppression de la facture:', error)
    throw error
  }
}

export const incrementPdfGenerationCount = async (id) => {
  try {
    // Note: Pas besoin de capturer response ici, sauf si vous attendez un contenu spécifique en retour
    await fetchApi(`invoices/incrementPdfGeneration/${id}`, 'PUT')
    console.log('Compteur de génération PDF mis à jour avec succès.')
  } catch (error) {
    // Ici, error devrait inclure toutes les informations pertinentes sur l'échec de la requête
    console.error("Erreur lors de l'appel à l'API:", error)
    // L'exception est relancée pour indiquer un échec dans l'opération d'incrémentation
    throw error
  }
}
