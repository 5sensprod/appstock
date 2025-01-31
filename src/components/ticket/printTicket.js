import { sendPrintRequest } from '../../ipcHelper'
import { generateCompanieInfo } from './generateCompanieInfo'
import { generateHeaderTicket } from './generateHeaderTicket'
import { generateBody } from './generateBody'
import { generateTotals } from './generateTotal'
import { generateTVA } from './generateTVA'
import { generatePaymentType } from './generatePaymentType'
import { generateRemerciement } from './generateRemerciement'
import { generateQRCodeHTML } from './generateQRCode'
import { generateLine } from './generateLine'
import moment from 'moment'
import 'moment/locale/fr'

export const printTicket = async (
  documentData,
  documentType,
  companyInfo,
  isEmpty = false,
) => {
  moment.locale('fr')

  if (isEmpty) {
    let printContentEmpty = `
<html>
<head>
<title>Ticket Vide</title>
<style>
  body {
    font-family: 'Helvetica', 'Arial', sans-serif;
    width: 8cm; /* Définit la largeur du contenu pour correspondre à la largeur du papier */
  }
</style>
</head>
<body>
  <!-- Contenu intentionnellement vide pour déclencher l'ouverture du tiroir-caisse -->
</body>
</html>`
    sendPrintRequest(printContentEmpty)
    return
  }

  const qrCodeHTML = await generateQRCodeHTML(documentData.number)

  const now = new Date()
  let formattedDateTime = moment(now).format('dddd D MMMM, HH:mm:ss')

  let printContent = `
<html>
<head>
<title>Print</title>
<style>
  @media print {
    @page {
      margin-top: -2mm;
      width: 8cm;
      margin-left:10px;
      margin-right:10px;

    }
    html, body {
      font-family: 'Helvetica', 'normal', sans-serif; width:8cm;
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
      font-size: 13px;
    }
    .item-details span {
      display: block;
    }
  }
  .company, .header, .content, .item, .item-details, .totalht, .total, .message {
    text-align: center; margin-top: 0; margin-bottom: 1px;
  }
</style>
</head>
<body>`

  printContent += generateCompanieInfo(companyInfo)

  printContent += generateLine('10px', '5px')
  printContent += generateHeaderTicket(documentData, formattedDateTime)

  printContent += generateLine('10px', '5px')
  printContent += generateBody(documentData.items)

  // Insérer une ligne de séparation avant et après generateTotals
  printContent += generateLine('10px', '10px')
  printContent += generateTotals(documentData)

  printContent += generateLine('10px', '5px')
  printContent += generateTVA(documentData.items)

  printContent += generateLine('10px', '5px')
  printContent += generatePaymentType({
    paymentType: documentData.paymentType,
    cashDetails: documentData.cashDetails,
    paymentDetails: documentData.paymentDetails,
    totalTTC: documentData.totalTTC,
    remainingAmount: documentData.remainingAmount,
    fontSize: '13px',
  })

  printContent += generateLine('5px', '10px')
  printContent += generateRemerciement()
  printContent += qrCodeHTML

  // Fin du contenu et envoi pour impression
  printContent += '</body></html>'
  sendPrintRequest(printContent)
}
