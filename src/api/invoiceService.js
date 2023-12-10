// src/api/invoiceService.js
import { fetchApi } from './axiosConfig'

export const getInvoices = async () => {
  try {
    return await fetchApi('invoices')
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
