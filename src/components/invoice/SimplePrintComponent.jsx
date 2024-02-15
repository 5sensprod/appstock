// Template ticket de caisse
import React, { useContext } from 'react'
import { Button } from '@mui/material'
import { CartContext } from '../../contexts/CartContext'
import { sendPrintRequest } from '../../ipcHelper'

const SimplePrintComponent = () => {
  const { invoiceData } = useContext(CartContext)
  const now = new Date()
  const dateStr = now.toLocaleDateString('fr-FR')
  const timeStr = now.toLocaleTimeString('fr-FR')

  const handlePrint = () => {
    let printContent = `
      <html>
        <head>
          <title>Print</title>
          <style>
            body { font-family: 'Arial', sans-serif; font-size: 14px; margin: 0; width:100%; }
            h3 { font-size: 16px; text-align: center; margin-bottom: 12px; }
            .content { margin: 5px 0; }
            .item { margin-bottom: 5px; }
            .item-details { display: flex; justify-content: space-between; border-bottom: 1px dashed; margin-bottom: 10px; }
            .totalht { margin-top: 5px }
            .total { font-weight: bold; margin-top: 10px; margin-bottom: 40px; }
            .message { margin-bottom: 20px; }
            .footer { margin-bottom: 20px; }
            .header { margin-bottom: 1px; }
            span { margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h2>AXE MUSIQUE</h2>
          <span class="header">4 rue Lochet</span>
          <span class="header">51000 Châlons en Champagne</span>
          <span class="header">03 26 65 74 95</span>
          <h3>Ticket de caisse</h3>
          <div class="content">${dateStr}, ${timeStr}</div>
    `

    invoiceData.items.forEach((item) => {
      printContent += `
        <div class="item">
          <div>${item.reference}</div>
          <div class="item-details">
            <span>Quantité: ${item.quantite}</span>
            <span>Prix: ${item.puTTC}€</span>
          </div>
        </div>`
    })

    printContent += `<div class="totalht">Total HT: ${invoiceData.totalHT}€</div>`
    printContent += `<div class="total">Total TTC: ${invoiceData.totalTTC}€</div>`
    printContent += '<div class="message">Merci de votre visite</div>'
    printContent += '<div class="footer">.</div>'
    printContent += '</body></html>'

    sendPrintRequest(printContent)
  }

  return (
    <Button variant="contained" onClick={handlePrint} size="small">
      Imprimer le ticket
    </Button>
  )
}

export default SimplePrintComponent
