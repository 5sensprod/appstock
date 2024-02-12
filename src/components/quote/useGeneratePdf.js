import React, { useContext } from 'react'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { getQuoteDetailsById } from '../../api/quoteService'
import { CompanyInfoContext } from '../../contexts/CompanyInfoContext'
import { formatPrice } from '../../utils/priceUtils'

export const useGeneratePdf = () => {
  const { companyInfo } = useContext(CompanyInfoContext)

  // Calculer la date de validité (30 jours après la date du devis)

  const generatePdf = async (quoteId) => {
    try {
      const quoteDetails = await getQuoteDetailsById(quoteId)
      const doc = new jsPDF()

      const dateDuDevis = new Date(quoteDetails.date)
      const validiteDevis = new Date(
        dateDuDevis.getTime() + 30 * 24 * 60 * 60 * 1000,
      )

      let currentYPosition = 10

      // Vérifier si companyInfo est disponible
      if (companyInfo) {
        doc.setFontSize(12)
        doc.text(companyInfo.name.toUpperCase(), 10, currentYPosition)
        currentYPosition += 5

        doc.setFontSize(10)
        doc.text(companyInfo.address, 10, currentYPosition)
        currentYPosition += 5
        doc.text(companyInfo.city, 10, currentYPosition)
        currentYPosition += 5
        doc.text(companyInfo.phone, 10, currentYPosition)
        currentYPosition += 5
        doc.text(companyInfo.email, 10, currentYPosition)
        currentYPosition += 5
        doc.text(companyInfo.taxId, 10, currentYPosition)
        currentYPosition += 10
      }

      // Calculer la position X pour "DEVIS"
      const devisText = 'DEVIS'
      doc.setFontSize(18) // Taille de police plus grande pour "DEVIS"
      const pageWidth = doc.internal.pageSize.getWidth()
      const devisTextWidth = doc.getTextWidth(devisText)
      const devisXPosition = pageWidth - devisTextWidth - 75 // 10 est la marge à droite

      // Position Y ajustée pour centrer "DEVIS" verticalement par rapport aux infos de l'entreprise
      const devisYPosition = currentYPosition - (5 * 5) / 2 // Exemple de calcul, ajustez selon votre mise en page

      doc.text(devisText, devisXPosition, devisYPosition)

      // En-tête du PDF ajusté pour éviter le chevauchement
      doc.setFontSize(10)
      doc.text(`N° : ${quoteDetails.quoteNumber}`, 10, currentYPosition)
      currentYPosition += 5

      doc.setFontSize(10)
      doc.text(
        `Valable jusqu'au : ${validiteDevis.toLocaleDateString()}`,
        10,
        currentYPosition,
      )
      currentYPosition += 5

      doc.setFontSize(12)
      doc.text(
        `Date : ${new Date(quoteDetails.date).toLocaleDateString()}`,
        10,
        currentYPosition,
      )
      currentYPosition += 5

      // Construction de la chaîne de caractères pour les informations du client
      let clientInfoStr = `Client :`
      const { name, email, phone } = quoteDetails.customerInfo
      // Vérifie et affiche le nom s'il est disponible
      if (name) {
        doc.text(`Client : ${name}`, 10, currentYPosition)
        currentYPosition += 5
      }

      // Vérifie et affiche l'email s'il est disponible
      if (email) {
        doc.text(`Email : ${email}`, 10, currentYPosition)
        currentYPosition += 5
      }

      // Vérifie et affiche le téléphone s'il est disponible
      if (phone) {
        doc.text(`Téléphone : ${phone}`, 10, currentYPosition)
        currentYPosition += 5
      }

      // Affichage des informations du client dans le PDF
      doc.text(clientInfoStr, 10, currentYPosition)
      currentYPosition += 5

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
        prixOriginal: formatPrice(item.prixOriginal), // Formaté
        quantity: item.quantity,
        prixHT: formatPrice(item.prixHT), // Formaté
        prixTTC: formatPrice(item.prixTTC), // Formaté
        tauxTVA: `${item.tauxTVA}%`,
        totalTTCParProduit: formatPrice(item.totalTTCParProduit), // Formaté
        remiseMajorationValue:
          item.remiseMajorationLabel && item.remiseMajorationValue
            ? item.remiseMajorationLabel === 'Majoration'
              ? `+${item.remiseMajorationValue}%`
              : `-${item.remiseMajorationValue}%`
            : '',
      }))
      console.log('Données pour le tableau des articles :', items)

      doc.autoTable({
        startY: (currentYPosition += 10),
        head: [itemHeaders.map((header) => header.title)],
        body: items.map((item) =>
          itemHeaders.map((header) => {
            return item[header.dataKey]
          }),
        ),
        headStyles: {
          fillColor: 255,
          textColor: 0,
          lineColor: [50, 50, 50],
        },
        bodyStyles: {},
        theme: 'striped',
      })

      // Récapitulatif des totaux
      const finalY = doc.lastAutoTable.finalY + 10

      const rightMargin = 15

      // Total HT
      const totalHTText = `Total HT : ${formatPrice(quoteDetails.totalHT)}`
      doc.setFontSize(10)
      const totalHTTextWidth = doc.getTextWidth(totalHTText)
      doc.text(totalHTText, pageWidth - totalHTTextWidth - rightMargin, finalY)

      // Net à payer
      const netAPayerText = `Net à payer : ${formatPrice(quoteDetails.totalTTC)}`
      doc.setFontSize(12)
      const netAPayerTextWidth = doc.getTextWidth(netAPayerText)
      doc.text(
        netAPayerText,
        pageWidth - netAPayerTextWidth - rightMargin,
        finalY + 7,
      )
      // Si vous avez des remises ou majorations, vous pouvez les ajouter ici

      // Enregistrement du PDF
      doc.save(`Devis-${quoteDetails.quoteNumber}.pdf`)
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
    }
  }

  return generatePdf
}
