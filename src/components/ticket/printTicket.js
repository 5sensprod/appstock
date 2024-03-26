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

export const printTicket = async (documentData, documentType, companyInfo) => {
  moment.locale('fr')
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

    }
    html, body {
      font-family: 'Helvetica', 'normal', sans-serif;
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
  printContent += generateHeaderTicket(documentData, formattedDateTime)
  printContent += generateBody(documentData.items)

  // Insérer une ligne de séparation avant et après generateTotals
  printContent += generateLine('10px', '5px')
  printContent += generateTotals(documentData)
  printContent += generateLine('5px', '10px')

  // Continuer à ajouter d'autres sections...
  printContent += generateTVA(documentData.items)
  printContent += generatePaymentType({
    paymentType: documentData.paymentType,
    cashDetails: documentData.cashDetails,
    paymentDetails: documentData.paymentDetails,
    totalTTC: documentData.totalTTC,
    remainingAmount: documentData.remainingAmount,
    fontSize: '13px',
  })
  printContent += generateRemerciement()
  printContent += qrCodeHTML

  // Fin du contenu et envoi pour impression
  printContent += '</body></html>'
  sendPrintRequest(printContent)
}
