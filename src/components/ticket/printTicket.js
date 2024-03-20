import { sendPrintRequest } from '../../ipcHelper'

export const printTicket = async (documentData) => {
  const now = new Date()
  const dateStr = now.toLocaleDateString('fr-FR')
  const timeStr = now.toLocaleTimeString('fr-FR')

  let printContent = `
    <html>
    <head>
      <title>Print</title>
      <style>
        /* Vos styles ici */
      </style>
    </head>
    <body>
        <h2>AXE MUSIQUE</h2>
        <div class="header">4 rue Lochet</div>
        <div class="header">51000 Châlons en Champagne</div>
        <div class="header">03 26 65 74 95</div>
        <h3>Ticket de caisse</h3>
        <div class="content">Numéro de ticket: ${documentData.number}</div>
        <div class="content">${dateStr}, ${timeStr}</div>
  `

  documentData.items.forEach((item) => {
    printContent += `
      <div class="item">
        <div>${item.reference}</div>
        <div class="item-details">
          <span>Quantité: ${item.quantite}</span>
          <span>Prix: ${item.puTTC}€</span>
        </div>
      </div>`
  })

  printContent += `<div class="totalht">Total HT: ${documentData.totalHT}€</div>`
  printContent += `<div class="total">Total TTC: ${documentData.totalTTC}€</div>`
  printContent += '<div class="message">Merci de votre visite</div>'
  printContent += '</body></html>'

  sendPrintRequest(printContent)
}
