import { jsPDF } from 'jspdf'
import { getQuoteDetailsById } from '../../api/quoteService'

export const useGeneratePdf = () => {
  const generatePdf = async (quoteId) => {
    try {
      const quoteDetails = await getQuoteDetailsById(quoteId)
      const doc = new jsPDF()

      // Mise en page et contenu du PDF
      // Utilisez les données de quoteDetails pour peupler le PDF
      doc.text(`Devis Numéro: ${quoteDetails.quoteNumber}`, 10, 10)
      // Ajoutez plus de détails selon vos besoins

      doc.save(`Devis-${quoteDetails.quoteNumber}.pdf`)
    } catch (error) {
      console.error('Erreur lors de la génération du PDF :', error)
    }
  }

  return generatePdf
}
