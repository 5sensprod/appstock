import { sendPrintRequest } from '../../ipcHelper'

// Fonction pour générer l'en-tête du ticket
function generateHeader(documentData, dateStr, timeStr) {
  return `
  <p style="text-align: center; font-size: 15px; margin-top: 0; margin-bottom: 1px; font-weight: bold;">AXE MUSIQUE</p>
  <p style="text-align: center; margin-top: 0; margin-bottom: 1px;">4 rue LOCHET</p>
  <p style="text-align: center; margin-top: 0; margin-bottom: 1px;">51000 Châlons en Champagne</p>
  <p style="text-align: center; margin-top: 0; margin-bottom: 1px;">03 26 65 74 95</p>
  <p style="text-align: center; margin-top: 0; margin-bottom: 1px;">contact@axemusique.com</p>
  <p style="text-align: center; margin-top: 0; margin-bottom: 1px;">FR23 4186475400031</p>
  <p style="text-align: center; margin-bottom: 1px; font-size: 14px; font-weight: bold;">TICKET</p>
  <p style="text-align: center;margin-bottom: 1px;margin-top: 0;">${documentData.number}</p>
  <p style="text-align: center;margin-bottom: 1px;margin-top: 0;">${dateStr}, ${timeStr}</p>
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

export const printTicket = async (documentData) => {
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
      margin-top: -2mm; /* Réduit la marge du haut */

    }
    html, body {

      font-family: 'Helvetica';
      font-size: 12pt; /* Augmente la taille de la police pour l'impression */
    }
    .header, .content, .item, .item-details, .totalht, .total, .message {
      text-align: center;
    }
    .header {
      font-size: 13px;
    }
    .content {
      font-size: 12px;
    }
    .item-details span {
      display: block;
    }
  }
  body {
    font-family: 'Arial', sans-serif;
    font-size: 10pt; /* Taille de police standard pour l'affichage à l'écran */
  }
  .header, .content, .item, .item-details, .totalht, .total, .message {
    text-align: center;
  }
</style>
</head>
<body>`

  printContent += generateHeader(documentData, dateStr, timeStr)
  printContent += generateBody(documentData.items)
  printContent += generateFooter(documentData)
  printContent += '</body></html>'

  sendPrintRequest(printContent)
}
