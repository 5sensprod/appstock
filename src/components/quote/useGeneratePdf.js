import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { getQuoteDetailsById } from '../../api/quoteService'

export const useGeneratePdf = () => {
  const generatePdf = async (quoteId) => {
    try {
      const quoteDetails = await getQuoteDetailsById(quoteId)
      const doc = new jsPDF()

      // En-tête du PDF
      doc.setFontSize(16)
      doc.text(`Devis Numéro: ${quoteDetails.quoteNumber}`, 10, 10)
      doc.setFontSize(12)
      doc.text(
        `Date: ${new Date(quoteDetails.date).toLocaleDateString()}`,
        10,
        20,
      )
      doc.text(`Client: ${quoteDetails.customerInfo.name}`, 10, 30)

      // Tableau des articles
      const itemHeaders = [
        { title: 'Référence', dataKey: 'reference' },
        { title: 'Prix cat.', dataKey: 'prixOriginal' },
        { title: 'Qté', dataKey: 'quantity' },
        { title: 'Remise/Maj', dataKey: 'remiseMajorationValue' },
        { title: 'Prix HT', dataKey: 'prixHT' },
        { title: 'Prix TTC', dataKey: 'prixTTC' },
        { title: 'TVA', dataKey: 'tauxTVA' },
        { title: 'Total TTC', dataKey: 'totalTTCParProduit' },
      ]

      const items = quoteDetails.items.map((item) => ({
        reference: item.reference,
        prixOriginal: `${item.prixOriginal} €`,
        quantity: item.quantity,
        prixHT: `${item.prixHT} €`,
        prixTTC: `${item.prixTTC} €`,
        tauxTVA: `${item.tauxTVA}%`,
        totalTTCParProduit: `${item.totalTTCParProduit} €`,
        remiseMajorationValue:
          item.remiseMajorationLabel && item.remiseMajorationValue
            ? item.remiseMajorationLabel === 'Majoration'
              ? `+${item.remiseMajorationValue}%`
              : `-${item.remiseMajorationValue}%`
            : '',
      }))
      console.log('Données pour le tableau des articles :', items)

      doc.autoTable({
        startY: 40,
        head: [itemHeaders.map((header) => header.title)],
        body: items.map((item) =>
          itemHeaders.map((header) => {
            // Assurez-vous que la valeur est correctement traitée
            return item[header.dataKey]
          }),
        ),
      })

      // Récapitulatif des totaux
      const finalY = doc.lastAutoTable.finalY + 10 // Position Y après le tableau
      doc.setFontSize(12)
      doc.text(`Total HT: ${quoteDetails.totalHT} €`, 10, finalY)
      doc.text(`Total TTC: ${quoteDetails.totalTTC} €`, 10, finalY + 10)

      // Si vous avez des remises ou majorations, vous pouvez les ajouter ici

      // Enregistrement du PDF
      doc.save(`Devis-${quoteDetails.quoteNumber}.pdf`)
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
    }
  }

  return generatePdf
}
