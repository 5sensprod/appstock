import { sendPrintRequest } from '../../ipcHelper'
import { generateHeader } from './generateHeader'
import moment from 'moment'
import 'moment/locale/fr'

// Fonction pour générer le corps du ticket avec les articles
function generateBody(items) {
  // Fonction pour formater les nombres
  const formatNumber = (input) => {
    const number = parseFloat(input)
    if (isNaN(number)) {
      return 'Invalid input' // Gère l'erreur selon les besoins
    }
    return number.toFixed(2).replace('.', ',')
  }

  // Détermine si la remise ou la majoration est appliquée
  const hasRemiseOrMajoration = items.some(
    (item) => item.remiseMajorationValue !== 0,
  )

  // Création du contenu du tableau
  let tableContent = '<table style="width:100%; border-collapse: collapse;">'
  tableContent += '<tr>'
  tableContent += '<th>Qté</th><th>Article</th><th>P.U. EUR</th>'
  if (hasRemiseOrMajoration) {
    tableContent += '<th>Rem. %</th>' // Ajoute la colonne si nécessaire
  }
  tableContent += '<th>TTC EUR</th><th>Tx</th>'
  tableContent += '</tr>'

  // Générer les lignes du tableau
  items.forEach((item) => {
    tableContent += '<tr>'
    tableContent += `<td style="text-align:center;">${item.quantite}</td>`
    tableContent += `<td>${item.reference}</td>`
    tableContent += `<td>${formatNumber(item.puHT)}</td>`
    if (hasRemiseOrMajoration) {
      tableContent += `<td>${formatNumber(item.remiseMajorationValue)}</td>` // Ajoute la cellule si nécessaire
    }
    tableContent += `<td>${formatNumber(item.prixTTC)}</td>`
    tableContent += `<td>${item.tauxTVA.toString().replace('.', ',')}</td>`
    tableContent += '</tr>'
  })

  tableContent += '</table>'
  return tableContent
}

// Fonction pour générer le pied de page du ticket
function generateFooter(documentData) {
  return `
    <div class="totalht" style="text-align: center;">Total HT: ${documentData.totalHT}€</div>
    <div class="total" style="text-align: center;">Total TTC: ${documentData.totalTTC}€</div>
    <div class="message" style="text-align: center;">Merci de votre visite</div>
  `
}

export const printTicket = async (documentData, documentType, companyInfo) => {
  moment.locale('fr') // Configure le locale de Moment.js à français

  const now = new Date() // Obtient la date et l'heure actuelles
  // Utilise Moment.js pour formater 'now' selon le format désiré directement
  let formattedDateTime = moment(now).format('dddd D MMMM, HH:mm:ss')

  let printContent = `
<html>
<head>
<title>Print</title>
<style>
  @media print {
    @page {
      margin-top: -2mm;

    }
    html, body {
      font-family: 'Helvetica', sans-serif;
      font-size: 12px;
    }
    .header, .content, .item, .item-details, .totalht, .total, .message {
      text-align: center; margin-top: 0; margin-bottom: 1px;
    }
    .company {
      font-size: 15px;
      font-weight: bold;
    }
    .header {
      font-size: 14px;
      font-weight: bold;
    }
    .line {
      text-align: center; margin-top: 0;
    }
    .content {
      font-size: 11px;
    }
    .item-details span {
      display: block;
    }
  }
  .company, .header, .content, .item, .item-details, .totalht, .total, .message {
    text-align: center; margin-top: 0; margin-bottom: 1px;
  }
  .company {
    font-size: 15px;
    font-weight: bold;
  }
  .header {
    font-size: 14px;
    font-weight: bold;
  }
  .line {
    text-align: center; margin-top: 0;
  }

</style>
</head>
<body>`

  printContent += generateHeader(documentData, formattedDateTime, companyInfo)
  printContent += generateBody(documentData.items)
  printContent += generateFooter(documentData)
  printContent += '</body></html>'

  sendPrintRequest(printContent)
}
