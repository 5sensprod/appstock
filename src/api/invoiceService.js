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
    const response = await fetchApi(
      `invoices/incrementPdfGeneration/${id}`,
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
