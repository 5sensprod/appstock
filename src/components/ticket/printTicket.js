import { sendPrintRequest } from '../../ipcHelper'

// Fonction pour générer l'en-tête du ticket
function generateHeader(documentData, dateStr, timeStr, companyInfo) {
  return `
  <p class="company">${companyInfo.name}</p>
  <p class="content">4 rue LOCHET</p>
  <p class="content"font-size: 11px">51000 Châlons en Champagne</p>
  <p class="content">03 26 65 74 95</p>
  <p class="content">contact@axemusique.com</p>
  <p class="content">FR23 4186475400031</p>
  <p class="line" style="margin-bottom: 5px;">.............................................................</p>
  <p class="header">TICKET</p>
  <p class="content">${documentData.number}</p>
  <p class="content">${dateStr}, ${timeStr}</p>
  <p class="line" style="margin-bottom: 0;">.............................................................</p>
`
}

// Fonction pour générer le corps du ticket avec les articles
function generateBody(items) {
  let bodyContent = ''
  items.forEach((item) => {
    bodyContent += `
      <div class="item" style="text-align: center;">
        <div>${item.reference}</div>
        <div class="item-details" style="text-align: center;">
          <span>Quantité: ${item.quantite}</span>
          <span>Prix: ${item.puTTC}€</span>
        </div>
      </div>
    `
  })
  return bodyContent
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
  const now = new Date()
  const dateStr = now.toLocaleDateString('fr-FR')
  const timeStr = now.toLocaleTimeString('fr-FR')

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

  printContent += generateHeader(documentData, dateStr, timeStr, companyInfo)
  printContent += generateBody(documentData.items)
  printContent += generateFooter(documentData)
  printContent += '</body></html>'

  sendPrintRequest(printContent)
}
