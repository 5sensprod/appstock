import { useContext } from 'react'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { getQuoteDetailsById } from '../../api/quoteService'
import { CompanyInfoContext } from '../../contexts/CompanyInfoContext'
import { formatPrice } from '../../utils/priceUtils'

export const useGenerateQuotePdf = () => {
  const { companyInfo } = useContext(CompanyInfoContext)

  const generatePdf = async (quoteId, onSuccess) => {
    try {
      const quoteDetails = await getQuoteDetailsById(quoteId)
      const doc = new jsPDF()

      const dateDuDevis = new Date(quoteDetails.date)
      const validiteDevis = new Date(
        dateDuDevis.getTime() + 30 * 24 * 60 * 60 * 1000,
      )

      let currentYPosition = 10

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

      const devisText = 'DEVIS'
      doc.setFontSize(18)
      const pageWidth = doc.internal.pageSize.getWidth()
      const devisTextWidth = doc.getTextWidth(devisText)
      const devisXPosition = pageWidth - devisTextWidth - 75

      const devisYPosition = currentYPosition - (5 * 5) / 2

      doc.text(devisText, devisXPosition, devisYPosition)

      doc.setFontSize(10)
      doc.text(`N° : ${quoteDetails.quoteNumber}`, 10, currentYPosition)
      currentYPosition += 5

      doc.setFontSize(10)
      doc.text(
        `Validité : ${validiteDevis.toLocaleDateString()}`,
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
      currentYPosition += 7

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.text(`CONTACT`, 10, currentYPosition)

      currentYPosition += 5

      // Construction de la chaîne de caractères pour les informations du client
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(12)

      const { name, email, phone } = quoteDetails.customerInfo
      if (name) {
        doc.text(`Client : ${name}`, 10, currentYPosition)
        currentYPosition += 5
      }

      if (email) {
        doc.text(`Email : ${email}`, 10, currentYPosition)
        currentYPosition += 5
      }

      if (phone) {
        doc.text(`Téléphone : ${phone}`, 10, currentYPosition)
        currentYPosition += 5
      }

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
        prixOriginal: formatPrice(item.prixOriginal),
        quantity: item.quantity,
        prixHT: formatPrice(item.prixHT),
        prixTTC: formatPrice(item.prixTTC),
        tauxTVA: `${item.tauxTVA}%`,
        totalTTCParProduit: formatPrice(item.totalTTCParProduit),
        remiseMajorationValue:
          item.remiseMajorationLabel && item.remiseMajorationValue
            ? item.remiseMajorationLabel === 'Majoration'
              ? `+${item.remiseMajorationValue}%`
              : `-${item.remiseMajorationValue}%`
            : '',
      }))

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

      const finalY = doc.lastAutoTable.finalY + 10

      const rightMargin = 15

      const totalHTText = `Total HT : ${formatPrice(quoteDetails.totalHT)}`
      doc.setFontSize(10)
      const totalHTTextWidth = doc.getTextWidth(totalHTText)
      doc.text(totalHTText, pageWidth - totalHTTextWidth - rightMargin, finalY)

      const netAPayerText = `Net à payer : ${formatPrice(quoteDetails.totalTTC)}`
      doc.setFontSize(12)
      const netAPayerTextWidth = doc.getTextWidth(netAPayerText)
      doc.text(
        netAPayerText,
        pageWidth - netAPayerTextWidth - rightMargin,
        finalY + 7,
      )

      // Enregistrement du PDF
      doc.save(`Devis-${quoteDetails.quoteNumber}.pdf`)
      if (onSuccess)
        onSuccess(
          `Devis-${quoteDetails.quoteNumber}.pdf a été créé avec succès.`,
        )
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
    }
  }

  return generatePdf
}
