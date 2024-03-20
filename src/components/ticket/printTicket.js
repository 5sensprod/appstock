import { sendPrintRequest } from '../../ipcHelper'

// Fonction pour générer l'en-tête du ticket
function generateHeader(documentData, dateStr, timeStr) {
  return `
    <h2>AXE MUSIQUE</h2>
    <div class="header">4 rue Lochet</div>
    <div class="header">51000 Châlons en Champagne</div>
    <div class="header">03 26 65 74 95</div>
    <h3>Ticket de caisse</h3>
    <div class="content">Numéro de ticket: ${documentData.number}</div>
    <div class="content">${dateStr}, ${timeStr}</div>
  `
}

// Fonction pour générer le corps du ticket avec les articles
function generateBody(items) {
  let bodyContent = ''
  items.forEach((item) => {
    bodyContent += `
      <div class="item">
        <div>${item.reference}</div>
        <div class="item-details">
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
    <div class="totalht">Total HT: ${documentData.totalHT}€</div>
    <div class="total">Total TTC: ${documentData.totalTTC}€</div>
    <div class="message">Merci de votre visite</div>
  `
}

export const printTicket = async (documentData) => {
  const now = new Date()
  const dateStr = now.toLocaleDateString('fr-FR')
  const timeStr = now.toLocaleTimeString('fr-FR')

  let printContent = '<html><head><title>Print</title></head><body>'
  printContent += generateHeader(documentData, dateStr, timeStr)
  printContent += generateBody(documentData.items)
  printContent += generateFooter(documentData)
  printContent += '</body></html>'

  sendPrintRequest(printContent)
}
