import React, { useContext } from 'react'
import { jsPDF } from 'jspdf'
import { useInvoices } from '../../contexts/InvoicesContext'
import { Button, Box, Typography } from '@mui/material'
import { CompanyInfoContext } from '../../contexts/CompanyInfoContext'
import moment from 'moment'
import 'jspdf-autotable'
import QRCode from 'qrcode'

const TicketGenerator = ({ ticketId, onPdfGenerated }) => {
  const { tickets } = useInvoices()
  const { companyInfo } = useContext(CompanyInfoContext)

  const ticket = tickets.find((ticket) => ticket._id === ticketId)

  if (!ticket) {
    return <Typography>Ticket non trouvé</Typography>
  }

  const generatePDF = async () => {
    const pageWidth = 100 // Largeur en mm pour un ticket de caisse

    const lineHeight = 6 // Hauteur de ligne pour le contenu textuel
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [pageWidth, 297], // Longueur de page A4, jsPDF ajoutera des pages au besoin
    })

    let currentY = 5 // Position de départ en Y
    pdf.setFontSize(13)
    pdf.setFont('helvetica', 'normal')

    // Fonction utilitaire pour centrer le texte
    const printCenteredText = (text, fontSize, fontStyle, yPosition) => {
      pdf.setFontSize(fontSize)
      pdf.setFont('helvetica', fontStyle)
      const textWidth = pdf.getTextWidth(text)
      const xPosition = (pageWidth - textWidth) / 2
      pdf.text(text, xPosition, yPosition)
    }

    // HeaderCompany
    if (companyInfo?.name) {
      printCenteredText(companyInfo.name.toUpperCase(), 16, 'bold', currentY)
      currentY += lineHeight
    }

    const bodyFields = ['address', 'city', 'phone', 'email']
    bodyFields.forEach((field) => {
      if (companyInfo[field]) {
        printCenteredText(companyInfo[field], 13, 'normal', currentY)
        currentY += lineHeight
      }
    })

    if (companyInfo?.taxId) {
      printCenteredText(companyInfo.taxId, 13, 'normal', currentY)
      currentY += lineHeight
    }

    // Suite de HeaderCompany avec la ligne pointillée...
    pdf.setLineDash([1, 1], 0) // Configuration de la ligne pointillée
    const lineYAfterHeaderCompany = currentY + 2 // Position Y pour la ligne après HeaderCompany
    pdf.line(
      10,
      lineYAfterHeaderCompany,
      pageWidth - 10,
      lineYAfterHeaderCompany,
    ) // Dessin de la ligne
    pdf.setLineDash() // Réinitialisation du style de ligne
    currentY += 10 // Espace après la ligne pointillée

    //HeaderPdf
    const title = 'TICKET'
    printCenteredText(title, 14, 'bold', currentY)
    currentY += lineHeight

    const ticketNumber = ticket.number || ticket.quoteNumber
    printCenteredText(`Numéro : ${ticketNumber}`, 13, 'normal', currentY)
    currentY += lineHeight

    const formattedDate = moment(ticket.date).format('LL, LTS')
    printCenteredText(`Le ${formattedDate}`, 14, 'normal', currentY)
    currentY += lineHeight

    // Une autre ligne pointillée après HeaderPdf si nécessaire
    pdf.setLineDash([1, 1], 0) // Réapplication de la ligne pointillée pour une nouvelle section
    const lineYAfterHeaderPdf = currentY + 2 // Position Y pour la ligne après HeaderPdf
    pdf.line(10, lineYAfterHeaderPdf, pageWidth - 10, lineYAfterHeaderPdf) // Dessin de la ligne
    pdf.setLineDash() // Réinitialisation du style de ligne pour les sections futures
    currentY += 5 // Espace après la ligne pointillée

    //Composant equilvalent BodyTicket !

    const formatNumber = (input) => {
      const number = parseFloat(input)
      if (isNaN(number)) {
        return 'Invalid input' // Retourne un message ou gère l'erreur comme souhaité
      }
      return number.toFixed(2).replace('.', ',')
    }

    // Configuration des colonnes du tableau
    const columns = [
      { header: 'Qté', dataKey: 'quantite' },
      { header: 'Article', dataKey: 'reference' },
      { header: 'P.U. EUR', dataKey: 'puHT' },
      { header: 'TTC EUR', dataKey: 'prixTTC' },
      { header: 'Tx', dataKey: 'tauxTVA' },
    ]

    // Détermination de la présence de remise ou majoration pour ajuster les colonnes
    const hasRemiseOrMajoration = ticket.items.some(
      (item) => item.remiseMajorationValue !== 0,
    )
    if (hasRemiseOrMajoration) {
      columns.splice(3, 0, {
        header: 'Rem. %',
        dataKey: 'remiseMajorationValue',
      }) // Insérer la colonne Remise/Majoration avant TTC EUR
    }

    // Préparer les données
    const data = ticket.items.map((item) => ({
      quantite: item.quantite || item.quantity,
      reference: item.reference,
      puHT: formatNumber(item.prixOriginal || item.puHT),
      remiseMajorationValue: formatNumber(item.remiseMajorationValue),
      prixTTC: formatNumber(
        (item.quantite || item.quantity) * (item.puTTC || item.prixTTC),
      ),
      tauxTVA: item.tauxTVA.toString().replace('.', ','),
    }))

    // Générer le tableau
    pdf.autoTable({
      theme: 'plain',
      startY: currentY,
      columns: columns,
      body: data,
      margin: { horizontal: 10 },
      styles: { fontSize: 10, cellPadding: 1, overflow: 'linebreak' },
      columnStyles: {
        quantite: { halign: 'center' },
        reference: { halign: 'left' },
        puHT: { halign: 'left' },
        remiseMajorationValue: { halign: 'left' },
        prixTTC: { halign: 'left' },
        tauxTVA: { halign: 'left' },
      },
      didDrawPage: function (data) {
        // Mettez à jour `currentY` au cas où vous ajouteriez plus de contenu après le tableau
        currentY = data.cursor.y
      },
    })

    //Ligne
    currentY += 3 // Ajoute un peu d'espace avant de dessiner la ligne pointillée

    pdf.setLineDash([1, 1], 0) // Configure le style de ligne pointillée ([longueur du segment, longueur de l'espace])
    pdf.line(10, currentY, pageWidth - 10, currentY) // Dessine la ligne pointillée
    pdf.setLineDash() // Réinitialise à une ligne pleine pour les futures utilisations

    currentY += 7

    // TotalTTC

    const TotalTTC = (totalTTC) => {
      // Convertir le total en string avec deux décimales et remplacer le point par une virgule
      const formattedTotalTTC = totalTTC.toFixed(2).replace('.', ',')

      // Position de départ pour "Total TTC EUR"
      const startXLeft = 10 // Aligné à gauche
      // Calcul de la position de départ pour le montant afin de l'aligner à droite
      const textWidth = pdf.getTextWidth(formattedTotalTTC)
      const startXRight = pageWidth - textWidth - 10 // Aligné à droite, 10 mm de marge

      pdf.setFontSize(13) // Correspond à fontSize: '12px'
      pdf.setFont('helvetica', 'bold')

      // Impression de "Total TTC EUR" aligné à gauche
      pdf.text('Total TTC EUR', startXLeft, currentY)
      // Impression du montant aligné à droite sur la même ligne
      pdf.text(formattedTotalTTC, startXRight, currentY)

      currentY += 3 // Ajustez pour l'espacement après cette ligne
    }

    // Appeler la fonction TotalTTC avec le montant total TTC
    TotalTTC(ticket.totalTTC)

    currentY += 1 // Ajoute un peu d'espace avant de dessiner la ligne pointillée

    pdf.setLineDash([1, 1], 0) // Configure le style de ligne pointillée ([longueur du segment, longueur de l'espace])
    pdf.line(10, currentY, pageWidth - 10, currentY) // Dessine la ligne pointillée
    pdf.setLineDash() // Réinitialise à une ligne pleine pour les futures utilisations

    currentY += 5
    const calculerTotauxParTVA = (items) => {
      const totauxParTVA = items.reduce((acc, item) => {
        // Récupération ou calcul des valeurs nécessaires
        const tauxTVA = item.tauxTVA.toString() + '%' // Assurer que le taux est une chaîne avec un signe %
        const quantite = item.quantite || item.quantity
        const puHT = item.puHT || item.prixHT
        const puTTC = item.puTTC || item.prixTTC

        // Calcul du montant de la TVA et des totaux si non fournis
        const montantTVA = item.montantTVA || (puTTC - puHT) * quantite
        const totalHT = puHT * quantite
        const totalTTC = puTTC * quantite

        // Initialisation ou mise à jour des totaux pour ce taux de TVA
        if (!acc[tauxTVA]) {
          acc[tauxTVA] = { totalHT: 0, montantTVA: 0, totalTTC: 0 }
        }

        acc[tauxTVA].totalHT += totalHT
        acc[tauxTVA].montantTVA += montantTVA
        acc[tauxTVA].totalTTC += totalTTC

        return acc
      }, {})

      // Convertir les totaux en format numérique approprié pour l'affichage
      Object.keys(totauxParTVA).forEach((taux) => {
        totauxParTVA[taux].totalHT = parseFloat(
          totauxParTVA[taux].totalHT.toFixed(2),
        )
        totauxParTVA[taux].montantTVA = parseFloat(
          totauxParTVA[taux].montantTVA.toFixed(2),
        )
        totauxParTVA[taux].totalTTC = parseFloat(
          totauxParTVA[taux].totalTTC.toFixed(2),
        )
      })

      return totauxParTVA
    }

    // Préparation des données pour la table des totaux par TVA
    const totauxTVAData = Object.entries(
      calculerTotauxParTVA(ticket.items),
    ).map(([taux, totals]) => ({
      tauxTVA: taux,
      totalHT: formatNumber(totals.totalHT),
      montantTVA: formatNumber(totals.montantTVA),
      totalTTC: formatNumber(totals.totalTTC),
    }))

    // Ajout des totaux généraux à une seconde structure de données pour ne pas interférer avec les en-têtes
    let totalGeneralHT = 0
    let totalGeneralTVA = 0
    let totalGeneralTTC = 0

    Object.values(totauxTVAData).forEach((totals) => {
      totalGeneralHT += parseFloat(totals.totalHT.replace(',', '.'))
      totalGeneralTVA += parseFloat(totals.montantTVA.replace(',', '.'))
      totalGeneralTTC += parseFloat(totals.totalTTC.replace(',', '.'))
    })

    const totauxGenerauxData = [
      {
        tauxTVA: 'Totaux',
        totalHT: formatNumber(totalGeneralHT),
        montantTVA: formatNumber(totalGeneralTVA),
        totalTTC: formatNumber(totalGeneralTTC),
      },
    ]

    // Configuration des colonnes pour autotable
    const totauxTVAColumns = [
      { header: 'Tx TVA', dataKey: 'tauxTVA' },
      { header: 'HT', dataKey: 'totalHT' },
      { header: 'TVA', dataKey: 'montantTVA' },
      { header: 'TTC', dataKey: 'totalTTC' },
    ]

    // Générer la table pour les données des totaux par TVA
    pdf.autoTable({
      startY: currentY,
      theme: 'plain',
      columns: totauxTVAColumns,
      body: totauxTVAData,
      margin: { horizontal: 10 },
      styles: { fontSize: 10, cellPadding: 1 },
      columnStyles: {
        tauxTVA: { halign: 'left' },
        totalHT: { halign: 'left' },
        montantTVA: { halign: 'left' },
        totalTTC: { halign: 'left' },
      },
    })
    currentY = pdf.lastAutoTable.finalY // + 5 // Ajoute un peu d'espace avant de dessiner la ligne pointillée

    pdf.setLineDash([1, 1], 0) // Configure le style de ligne pointillée ([longueur du segment, longueur de l'espace])
    pdf.line(10, currentY, pageWidth - 15, currentY) // Dessine la ligne pointillée
    pdf.setLineDash() // Réinitialise à une ligne pleine pour les futures utilisations

    currentY += 1

    // Générer la table pour les totaux généraux
    pdf.autoTable({
      startY: currentY,
      theme: 'plain',
      columns: totauxTVAColumns,
      body: totauxGenerauxData,
      margin: { horizontal: 10 },
      styles: { fontSize: 10, cellPadding: 1, fontStyle: 'bold' },
      columnStyles: {
        tauxTVA: { halign: 'left' },
        totalHT: { halign: 'left' },
        montantTVA: { halign: 'left' },
        totalTTC: { halign: 'left' },
      },
      showHead: 'never', // Ne pas réafficher les en-têtes pour cette section
    })

    currentY = pdf.lastAutoTable.finalY // + 5 // Ajoute un peu d'espace avant de dessiner la ligne pointillée

    pdf.setLineDash([1, 1], 0) // Réapplique le style de ligne pointillée
    pdf.line(10, currentY, pageWidth - 15, currentY) // Dessine une autre ligne pointillée après le dernier tableau
    pdf.setLineDash() // Réinitialise à une ligne pleine après avoir dessiné

    currentY += 5

    // Fonction pour obtenir un type de paiement lisible
    const getReadablePaymentType = (type) => {
      switch (type) {
        case 'CB':
          return 'Carte Bancaire'
        case 'Cash':
          return 'Espèces'
        case 'Cheque':
          return 'Chèque'
        case 'ChequeCadeau':
          return 'Chèque Cadeau'
        case 'Virement':
          return 'Virement'
        case 'Avoir':
          return 'Avoir'
        default:
          return type
      }
    }

    // Fonction pour formater les montants
    const formatAmount = (amount) => {
      return parseFloat(amount).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    }

    // Paiement...
    const paymentDetails = [
      ...(ticket.paymentType === 'Cash'
        ? [
            {
              label: getReadablePaymentType(ticket.paymentType),
              value: formatAmount(ticket.cashDetails.givenAmount),
            },
            ...(ticket.cashDetails.changeAmount !== undefined
              ? [
                  {
                    label: 'Rendu',
                    value: formatAmount(ticket.cashDetails.changeAmount),
                  },
                ]
              : []),
          ]
        : []),
      ...(ticket.paymentType === 'Multiple'
        ? ticket.paymentDetails.map((detail) => ({
            label: getReadablePaymentType(detail.type),
            value: formatAmount(detail.amount),
          }))
        : []),
      ...(ticket.paymentType !== 'Cash' && ticket.paymentType !== 'Multiple'
        ? [
            {
              label: getReadablePaymentType(ticket.paymentType),
              value: formatAmount(ticket.totalTTC),
            },
          ]
        : []),
      ...(ticket.remainingAmount < 0
        ? [{ label: 'Rendu', value: formatAmount(-ticket.remainingAmount) }]
        : []),
    ]
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')

    currentY += 1

    // Boucle sur les détails de paiement pour les afficher
    paymentDetails.forEach((detail) => {
      pdf.text(`${detail.label} : ${detail.value} €`, 10, currentY)
      currentY += lineHeight
    })

    // Ajouter une ligne pointillée après les détails de paiement si nécessaire
    //currentY += 5
    pdf.setLineDash([1, 1], 0)
    pdf.line(10, currentY, pageWidth - 10, currentY)
    pdf.setLineDash()
    currentY += 10

    // Remerciement
    printCenteredText('Merci de votre visite !', 16, 'normal', currentY)
    currentY += lineHeight

    //qrcode à mettre ici
    const insertQRCodeToPDF = async () => {
      try {
        const qrCodeDataURL = await QRCode.toDataURL(ticket.number, {
          width: 20,
          margin: 1,
        })
        // Calculer la position x pour centrer le QR Code sur la page
        const qrCodeXPosition = (pageWidth - 20) / 2 // 50 est la largeur du QR Code
        pdf.addImage(qrCodeDataURL, 'PNG', qrCodeXPosition, currentY, 20, 20) // Ajouter le QR Code au PDF
      } catch (error) {
        console.error('Erreur lors de la génération du QR Code:', error)
      }
    }

    await insertQRCodeToPDF() // Assurez-vous d'attendre la résolution de cette fonction asynchrone

    currentY += 60

    // Gestion de la mention "DUPLICATA" si nécessaire
    // Avant de sauvegarder ou d'imprimer le PDF, vérifiez si c'est un duplicata
    if (ticket.pdfGenerationCount > 0) {
      pdf.setGState(new pdf.GState({ opacity: 0.9 })) // Ajustez l'opacité si nécessaire
      pdf.setTextColor(255, 0, 0) // Rouge
      pdf.setFontSize(24) // Taille de la police pour "DUPLICATA"

      // Calculer la position centrale sur l'axe X
      const textWidth =
        (pdf.getStringUnitWidth('DUPLICATA') * pdf.internal.getFontSize()) /
        pdf.internal.scaleFactor
      const textX = (pdf.internal.pageSize.getWidth() - textWidth) / 2

      // Définir la position Y à 10mm du haut
      const textY = 42

      // Ajouter le texte "DUPLICATA" en utilisant les coordonnées calculées
      pdf.text('DUPLICATA', textX, textY, { align: 'center' })
    }

    // Sauvegarder le PDF ou le préparer pour l'impression
    // Construire le nom du fichier en incluant "duplicata" si nécessaire
    let fileName = `${ticket.number}.pdf`
    if (ticket.pdfGenerationCount > 0) {
      fileName = `${ticket.number}-duplicata${ticket.pdfGenerationCount}.pdf`
    }

    pdf.save(fileName)

    // Si vous avez une fonction de callback à appeler une fois le PDF généré
    if (onPdfGenerated) {
      onPdfGenerated()
    }
  }

  return (
    <Box textAlign={'center'}>
      <Button variant="contained" onClick={generatePDF}>
        Télécharger Ticket
      </Button>
    </Box>
  )
}

export default TicketGenerator
