// src/api/printService.js
import { fetchApi } from './axiosConfig'

export const sendPrintRequest = async (printContent) => {
  try {
    // Vous pourriez passer plus de détails ici si nécessaire (comme des paramètres d'impression)
    return await fetchApi('print', 'POST', { content: printContent })
  } catch (error) {
    console.error("Erreur lors de l'envoi de la demande d'impression:", error)
    throw error // Relancer pour la gestion d'erreur dans ipcHelper.js
  }
}
